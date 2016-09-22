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

var _normalizeIds = require('../../utils/normalizeIds');

var _normalizeIds2 = _interopRequireDefault(_normalizeIds);

var _QueryBuilderOperation = require('../../queryBuilder/operations/QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HasManyRelateOperation = function (_QueryBuilderOperatio) {
  (0, _inherits3.default)(HasManyRelateOperation, _QueryBuilderOperatio);

  function HasManyRelateOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, HasManyRelateOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _QueryBuilderOperatio.call(this, knex, name, opt));

    _this.isWriteOperation = true;
    _this.relation = opt.relation;
    _this.owner = opt.owner;
    _this.input = null;
    _this.ids = null;
    return _this;
  }

  HasManyRelateOperation.prototype.call = function call(builder, args) {
    this.input = args[0];
    this.ids = (0, _normalizeIds2.default)(args[0], this.relation.relatedModelClass.getIdPropertyArray(), { arrayOutput: true });
    return true;
  };

  HasManyRelateOperation.prototype.queryExecutor = function queryExecutor(builder) {
    var patch = {};

    for (var i = 0, l = this.relation.relatedProp.length; i < l; ++i) {
      var relatedProp = this.relation.relatedProp[i];
      var ownerProp = this.relation.ownerProp[i];

      patch[relatedProp] = this.owner[ownerProp];
    }

    return this.relation.relatedModelClass.query().childQueryOf(builder).patch(patch).copyFrom(builder, /where/i).whereInComposite(this.relation.relatedModelClass.getFullIdColumn(), this.ids).modify(this.relation.modify);
  };

  HasManyRelateOperation.prototype.onAfterInternal = function onAfterInternal() {
    return this.input;
  };

  return HasManyRelateOperation;
}(_QueryBuilderOperation2.default);

exports.default = HasManyRelateOperation;