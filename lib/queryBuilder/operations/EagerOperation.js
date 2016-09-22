'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _clone2 = require('lodash/clone');

var _clone3 = _interopRequireDefault(_clone2);

var _QueryBuilderOperation = require('./QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EagerOperation = function (_QueryBuilderOperatio) {
  (0, _inherits3.default)(EagerOperation, _QueryBuilderOperatio);

  function EagerOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, EagerOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _QueryBuilderOperatio.call(this, knex, name, opt));

    _this.expression = null;
    _this.filters = null;
    return _this;
  }

  EagerOperation.prototype.clone = function clone(props) {
    props = props || {};
    var copy = new this.constructor(this.knex, this.name, props.opt || (0, _clone3.default)(this.opt));

    copy.isWriteOperation = this.isWriteOperation;
    copy.expression = this.expression.clone();
    copy.filters = (0, _clone3.default)(this.filters);

    return copy;
  };

  EagerOperation.prototype.call = function call(builder, args) {
    this.expression = args[0].clone();
    this.filters = args[1];

    for (var i = 0, l = this.filters.length; i < l; ++i) {
      var filter = this.filters[i];
      this.expression.addAnonymousFilterAtPath(filter.path, filter.filter);
    }

    return true;
  };

  return EagerOperation;
}(_QueryBuilderOperation2.default);

exports.default = EagerOperation;