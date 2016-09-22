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

var _InsertOperation2 = require('../../queryBuilder/operations/InsertOperation');

var _InsertOperation3 = _interopRequireDefault(_InsertOperation2);

var _promiseUtils = require('../../utils/promiseUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HasManyInsertOperation = function (_InsertOperation) {
  (0, _inherits3.default)(HasManyInsertOperation, _InsertOperation);

  function HasManyInsertOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, HasManyInsertOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _InsertOperation.call(this, knex, name, opt));

    _this.relation = opt.relation;
    _this.owner = opt.owner;
    return _this;
  }

  HasManyInsertOperation.prototype.call = function call(builder, args) {
    var retVal = _InsertOperation.prototype.call.call(this, builder, args);

    for (var i = 0, lm = this.models.length; i < lm; ++i) {
      var model = this.models[i];

      for (var j = 0, lp = this.relation.relatedProp.length; j < lp; ++j) {
        var relatedProp = this.relation.relatedProp[j];
        var ownerProp = this.relation.ownerProp[j];

        model[relatedProp] = this.owner[ownerProp];
      }
    }

    return retVal;
  };

  HasManyInsertOperation.prototype.onAfterQuery = function onAfterQuery(builder, inserted) {
    var _this2 = this;

    var maybePromise = _InsertOperation.prototype.onAfterQuery.call(this, builder, inserted);

    return (0, _promiseUtils.after)(maybePromise, function (inserted) {
      _this2.relation.appendRelationProp(_this2.owner, inserted);
      return inserted;
    });
  };

  return HasManyInsertOperation;
}(_InsertOperation3.default);

exports.default = HasManyInsertOperation;