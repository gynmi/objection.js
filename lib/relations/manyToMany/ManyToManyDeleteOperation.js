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

var _DeleteOperation2 = require('../../queryBuilder/operations/DeleteOperation');

var _DeleteOperation3 = _interopRequireDefault(_DeleteOperation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ManyToManyDeleteOperation = function (_DeleteOperation) {
  (0, _inherits3.default)(ManyToManyDeleteOperation, _DeleteOperation);

  function ManyToManyDeleteOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, ManyToManyDeleteOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _DeleteOperation.call(this, knex, name, opt));

    _this.relation = opt.relation;
    _this.owner = opt.owner;
    return _this;
  }

  ManyToManyDeleteOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {
    _DeleteOperation.prototype.onBeforeBuild.call(this, builder);
    this.relation.selectForModify(builder, this.owner).modify(this.relation.modify);
  };

  return ManyToManyDeleteOperation;
}(_DeleteOperation3.default);

exports.default = ManyToManyDeleteOperation;