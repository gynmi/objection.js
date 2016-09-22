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

var _QueryBuilderBase = require('../QueryBuilderBase');

var _QueryBuilderBase2 = _interopRequireDefault(_QueryBuilderBase);

var _QueryBuilderOperation = require('./QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

var _dbUtils = require('../../utils/dbUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WrappingQueryBuilderOperation = function (_QueryBuilderOperatio) {
  (0, _inherits3.default)(WrappingQueryBuilderOperation, _QueryBuilderOperatio);

  function WrappingQueryBuilderOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, WrappingQueryBuilderOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _QueryBuilderOperatio.call(this, knex, name, opt));

    _this.args = null;
    return _this;
  }

  WrappingQueryBuilderOperation.prototype.call = function call(builder, args) {
    var ret = wrapArgs(this, builder, args);
    this.args = args;
    return ret;
  };

  return WrappingQueryBuilderOperation;
}(_QueryBuilderOperation2.default);

exports.default = WrappingQueryBuilderOperation;


function wrapArgs(op, builder, args) {
  var skipUndefined = builder.shouldSkipUndefined();
  var knex = builder.knex();

  for (var i = 0, l = args.length; i < l; ++i) {
    var arg = args[i];

    if (arg === undefined) {
      if (skipUndefined) {
        return false;
      } else {
        throw new Error('undefined passed as argument #' + l + ' for \'' + op.name + '\' operation. Call skipUndefined() method to ignore the undefined values.');
      }
    } else if (arg instanceof _QueryBuilderBase2.default) {
      // Convert QueryBuilderBase instances into knex query builders.
      args[i] = arg.build();
    } else if (Array.isArray(arg)) {
      if (skipUndefined) {
        args[i] = withoutUndefined(arg);
      } else if (includesUndefined(arg)) {
        throw new Error('undefined passed as an item in argument #' + l + ' for \'' + op.name + '\' operation. Call skipUndefined() method to ignore the undefined values.');
      }
    } else if (typeof arg === 'function') {
      // If an argument is a function, knex calls it with a query builder as
      // first argument (and as `this` context). We wrap the query builder into
      // a QueryBuilderBase instance.
      args[i] = wrapFunctionArg(arg, knex);
    }
  }

  return true;
}

function wrapFunctionArg(func, knex) {
  return function wrappedKnexFunctionArg() {
    if ((0, _dbUtils.isKnexQueryBuilder)(this)) {
      var knexQueryBuilder = this;
      // Wrap knex query builder into a QueryBuilderBase so that we can use
      // our extended query builder in nested queries.
      var wrappedQueryBuilder = new _QueryBuilderBase2.default(knex);

      func.call(wrappedQueryBuilder, wrappedQueryBuilder);
      wrappedQueryBuilder.buildInto(knexQueryBuilder);
    } else {
      // This case is for function argument `join` operation and other methods that
      // Don't take a query builder as the first parameter.
      return func.apply(this, arguments);
    }
  };
}

function withoutUndefined(arr) {
  var out = [];

  for (var i = 0, l = arr.length; i < l; ++i) {
    if (arr[i] !== undefined) {
      out.push(arr[i]);
    }
  }

  return out;
}

function includesUndefined(arr) {
  for (var i = 0, l = arr.length; i < l; ++i) {
    if (arr[i] === undefined) {
      return true;
    }
  }

  return false;
}