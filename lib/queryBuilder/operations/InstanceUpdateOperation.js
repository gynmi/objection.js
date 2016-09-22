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

var _UpdateOperation2 = require('./UpdateOperation');

var _UpdateOperation3 = _interopRequireDefault(_UpdateOperation2);

var _promiseUtils = require('../../utils/promiseUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InstanceUpdateOperation = function (_UpdateOperation) {
  (0, _inherits3.default)(InstanceUpdateOperation, _UpdateOperation);

  function InstanceUpdateOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, InstanceUpdateOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _UpdateOperation.call(this, knex, name, opt));

    _this.instance = opt.instance;
    _this.modelOptions.old = opt.instance;
    return _this;
  }

  InstanceUpdateOperation.prototype.call = function call(builder, args) {
    var retVal = _UpdateOperation.prototype.call.call(this, builder, args);

    if (!this.model) {
      this.model = this.instance;
    }

    return retVal;
  };

  InstanceUpdateOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {
    _UpdateOperation.prototype.onBeforeBuild.call(this, builder);
    builder.whereComposite(builder.modelClass().getFullIdColumn(), this.instance.$id());
  };

  InstanceUpdateOperation.prototype.onAfterInternal = function onAfterInternal(builder, numUpdated) {
    var _this2 = this;

    var maybePromise = _UpdateOperation.prototype.onAfterInternal.call(this, builder, numUpdated);
    return (0, _promiseUtils.after)(maybePromise, function (result) {
      _this2.instance.$set(_this2.model);
      return result;
    });
  };

  return InstanceUpdateOperation;
}(_UpdateOperation3.default);

exports.default = InstanceUpdateOperation;