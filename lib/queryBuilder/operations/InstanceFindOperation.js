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

var _FindOperation2 = require('./FindOperation');

var _FindOperation3 = _interopRequireDefault(_FindOperation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InstanceFindOperation = function (_FindOperation) {
  (0, _inherits3.default)(InstanceFindOperation, _FindOperation);

  function InstanceFindOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, InstanceFindOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _FindOperation.call(this, knex, name, opt));

    _this.instance = opt.instance;
    return _this;
  }

  InstanceFindOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {
    builder.whereComposite(builder.modelClass().getFullIdColumn(), this.instance.$id()).first();
  };

  return InstanceFindOperation;
}(_FindOperation3.default);

exports.default = InstanceFindOperation;