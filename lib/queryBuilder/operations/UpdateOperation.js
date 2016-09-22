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

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _QueryBuilderOperation = require('./QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

var _promiseUtils = require('../../utils/promiseUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UpdateOperation = function (_QueryBuilderOperatio) {
  (0, _inherits3.default)(UpdateOperation, _QueryBuilderOperatio);

  function UpdateOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, UpdateOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _QueryBuilderOperatio.call(this, knex, name, opt));

    _this.model = null;
    _this.modelOptions = (0, _clone2.default)(_this.opt.modelOptions) || {};
    _this.isWriteOperation = true;
    return _this;
  }

  UpdateOperation.prototype.call = function call(builder, args) {
    this.model = builder.modelClass().ensureModel(args[0], this.modelOptions);
    return true;
  };

  UpdateOperation.prototype.onBeforeInternal = function onBeforeInternal(builder, result) {
    var maybePromise = this.model.$beforeUpdate(this.modelOptions, builder.context());
    return (0, _promiseUtils.afterReturn)(maybePromise, result);
  };

  UpdateOperation.prototype.onBuild = function onBuild(knexBuilder, builder) {
    var json = this.model.$toDatabaseJson();
    var update = (0, _omit2.default)(json, builder.modelClass().getIdColumnArray());
    knexBuilder.update(update);
  };

  UpdateOperation.prototype.onAfterInternal = function onAfterInternal(builder, numUpdated) {
    var maybePromise = this.model.$afterUpdate(this.modelOptions, builder.context());
    return (0, _promiseUtils.afterReturn)(maybePromise, numUpdated);
  };

  return UpdateOperation;
}(_QueryBuilderOperation2.default);

exports.default = UpdateOperation;