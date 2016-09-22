'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DelegateOperation2 = require('./DelegateOperation');

var _DelegateOperation3 = _interopRequireDefault(_DelegateOperation2);

var _promiseUtils = require('../../utils/promiseUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UpdateAndFetchOperation = function (_DelegateOperation) {
  (0, _inherits3.default)(UpdateAndFetchOperation, _DelegateOperation);

  function UpdateAndFetchOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, UpdateAndFetchOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _DelegateOperation.call(this, knex, name, opt));

    _this.id = null;
    return _this;
  }

  UpdateAndFetchOperation.prototype.call = function call(builder, args) {
    this.id = args[0];
    return this.delegate.call(builder, args.slice(1));
  };

  UpdateAndFetchOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {
    _DelegateOperation.prototype.onBeforeBuild.call(this, builder);
    builder.whereComposite(builder.modelClass().getFullIdColumn(), this.id);
  };

  UpdateAndFetchOperation.prototype.onAfterInternal = function onAfterInternal(builder, numUpdated) {
    var _this2 = this;

    if (numUpdated == 0) {
      // If nothing was updated, we should fetch nothing.
      return (0, _promiseUtils.afterReturn)(_DelegateOperation.prototype.onAfterInternal.call(this, builder, numUpdated), undefined);
    }

    return builder.modelClass().query().childQueryOf(builder).whereComposite(builder.modelClass().getFullIdColumn(), this.id).first().then(function (fetched) {
      var retVal = null;

      if (fetched) {
        _this2.model.$set(fetched);
        retVal = _this2.model;
      }

      return (0, _promiseUtils.afterReturn)(_DelegateOperation.prototype.onAfterInternal.call(_this2, builder, numUpdated), retVal);
    });
  };

  (0, _createClass3.default)(UpdateAndFetchOperation, [{
    key: 'model',
    get: function get() {
      return this.delegate.model;
    }
  }]);
  return UpdateAndFetchOperation;
}(_DelegateOperation3.default);

exports.default = UpdateAndFetchOperation;