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

var _QueryBuilderOperation = require('../../queryBuilder/operations/QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HasManyUnrelateOperation = function (_QueryBuilderOperatio) {
  (0, _inherits3.default)(HasManyUnrelateOperation, _QueryBuilderOperatio);

  function HasManyUnrelateOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, HasManyUnrelateOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _QueryBuilderOperatio.call(this, knex, name, opt));

    _this.isWriteOperation = true;
    _this.relation = opt.relation;
    _this.owner = opt.owner;
    _this.ids = null;
    return _this;
  }

  HasManyUnrelateOperation.prototype.queryExecutor = function queryExecutor(builder) {
    var patch = {};

    for (var i = 0, l = this.relation.relatedProp.length; i < l; ++i) {
      patch[this.relation.relatedProp[i]] = null;
    }

    return this.relation.relatedModelClass.query().childQueryOf(builder).patch(patch).copyFrom(builder, /where/i).whereComposite(this.relation.fullRelatedCol(), this.owner.$values(this.relation.ownerProp)).modify(this.relation.modify);
  };

  HasManyUnrelateOperation.prototype.onAfterInternal = function onAfterInternal() {
    return {};
  };

  return HasManyUnrelateOperation;
}(_QueryBuilderOperation2.default);

exports.default = HasManyUnrelateOperation;