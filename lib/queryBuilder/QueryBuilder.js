'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _desc, _value, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _queryBuilderOperation = require('./decorators/queryBuilderOperation');

var _queryBuilderOperation2 = _interopRequireDefault(_queryBuilderOperation);

var _QueryBuilderContext = require('./QueryBuilderContext');

var _QueryBuilderContext2 = _interopRequireDefault(_QueryBuilderContext);

var _RelationExpression = require('./RelationExpression');

var _RelationExpression2 = _interopRequireDefault(_RelationExpression);

var _QueryBuilderBase2 = require('./QueryBuilderBase');

var _QueryBuilderBase3 = _interopRequireDefault(_QueryBuilderBase2);

var _ValidationError = require('../ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _FindOperation = require('./operations/FindOperation');

var _FindOperation2 = _interopRequireDefault(_FindOperation);

var _DeleteOperation = require('./operations/DeleteOperation');

var _DeleteOperation2 = _interopRequireDefault(_DeleteOperation);

var _UpdateOperation = require('./operations/UpdateOperation');

var _UpdateOperation2 = _interopRequireDefault(_UpdateOperation);

var _InsertOperation = require('./operations/InsertOperation');

var _InsertOperation2 = _interopRequireDefault(_InsertOperation);

var _InsertGraphAndFetchOperation = require('./operations/InsertGraphAndFetchOperation');

var _InsertGraphAndFetchOperation2 = _interopRequireDefault(_InsertGraphAndFetchOperation);

var _InsertAndFetchOperation = require('./operations/InsertAndFetchOperation');

var _InsertAndFetchOperation2 = _interopRequireDefault(_InsertAndFetchOperation);

var _UpdateAndFetchOperation = require('./operations/UpdateAndFetchOperation');

var _UpdateAndFetchOperation2 = _interopRequireDefault(_UpdateAndFetchOperation);

var _QueryBuilderOperation = require('./operations/QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

var _JoinRelationOperation = require('./operations/JoinRelationOperation');

var _JoinRelationOperation2 = _interopRequireDefault(_JoinRelationOperation);

var _InsertGraphOperation = require('./operations/InsertGraphOperation');

var _InsertGraphOperation2 = _interopRequireDefault(_InsertGraphOperation);

var _RunBeforeOperation = require('./operations/RunBeforeOperation');

var _RunBeforeOperation2 = _interopRequireDefault(_RunBeforeOperation);

var _RunAfterOperation = require('./operations/RunAfterOperation');

var _RunAfterOperation2 = _interopRequireDefault(_RunAfterOperation);

var _OnBuildOperation = require('./operations/OnBuildOperation');

var _OnBuildOperation2 = _interopRequireDefault(_OnBuildOperation);

var _SelectOperation = require('./operations/SelectOperation');

var _SelectOperation2 = _interopRequireDefault(_SelectOperation);

var _EagerOperation = require('./operations/EagerOperation');

var _EagerOperation2 = _interopRequireDefault(_EagerOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var QueryBuilder = (_dec = (0, _queryBuilderOperation2.default)(_RunBeforeOperation2.default), _dec2 = (0, _queryBuilderOperation2.default)(_OnBuildOperation2.default), _dec3 = (0, _queryBuilderOperation2.default)(_RunAfterOperation2.default), _dec4 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'join' }]), _dec5 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'innerJoin' }]), _dec6 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'outerJoin' }]), _dec7 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'leftJoin' }]), _dec8 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'leftOuterJoin' }]), _dec9 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'rightJoin' }]), _dec10 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'rightOuterJoin' }]), _dec11 = (0, _queryBuilderOperation2.default)([_JoinRelationOperation2.default, { joinOperation: 'fullOuterJoin' }]), (_class = function (_QueryBuilderBase) {
  (0, _inherits3.default)(QueryBuilder, _QueryBuilderBase);

  function QueryBuilder(modelClass) {
    (0, _classCallCheck3.default)(this, QueryBuilder);

    var _this = (0, _possibleConstructorReturn3.default)(this, _QueryBuilderBase.call(this, modelClass.knex(), _QueryBuilderContext2.default));

    _this._modelClass = modelClass;
    _this._explicitRejectValue = null;
    _this._explicitResolveValue = null;

    _this._eagerExpression = null;
    _this._eagerFilterExpressions = [];
    _this._allowedEagerExpression = null;
    _this._allowedInsertExpression = null;

    _this._findOperationOptions = {};
    _this._eagerOperationOptions = {};

    _this._findOperationFactory = findOperationFactory;
    _this._insertOperationFactory = insertOperationFactory;
    _this._updateOperationFactory = updateOperationFactory;
    _this._patchOperationFactory = patchOperationFactory;
    _this._relateOperationFactory = relateOperationFactory;
    _this._unrelateOperationFactory = unrelateOperationFactory;
    _this._deleteOperationFactory = deleteOperationFactory;
    _this._eagerOperationFactory = modelClass.defaultEagerAlgorithm;

    _this.stack = new Error().stack;
    return _this;
  }

  /**
   * @param {Model} modelClass
   * @returns {QueryBuilder}
   */


  QueryBuilder.forClass = function forClass(modelClass) {
    return new this(modelClass);
  };

  /**
   * @param {QueryBuilderBase} query
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.childQueryOf = function childQueryOf(query) {
    if (query) {
      this.internalContext(query.internalContext());
    }

    return this;
  };

  /**
   * @param {Error} error
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.reject = function reject(error) {
    this._explicitRejectValue = error;
    return this;
  };

  /**
   * @param {*} value
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.resolve = function resolve(value) {
    this._explicitResolveValue = value;
    return this;
  };

  /**
   * @returns {boolean}
   */


  QueryBuilder.prototype.isExecutable = function isExecutable() {
    var hasExecutor = !!this._queryExecutorOperation();
    return !this._explicitRejectValue && !this._explicitResolveValue && !hasExecutor;
  };

  /**
   * @param {function(*, QueryBuilder)} runBefore
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.runBefore = function runBefore(_runBefore) {};

  /**
   * @param {function(QueryBuilder)} onBuild
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.onBuild = function onBuild(_onBuild) {};

  /**
   * @param {function(Model|Array.<Model>, QueryBuilder)} runAfter
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.runAfter = function runAfter(_runAfter) {};

  /**
   * @param {function(QueryBuilder):EagerOperation} algorithm
   * @param {object=} eagerOptions
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.eagerAlgorithm = function eagerAlgorithm(algorithm, eagerOptions) {
    this.eagerOperationFactory(algorithm);

    if (eagerOptions) {
      this.eagerOptions(eagerOptions);
    }

    return this;
  };

  /**
   * @param {function(QueryBuilder):EagerOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.eagerOperationFactory = function eagerOperationFactory(factory) {
    this._eagerOperationFactory = factory;
    return this;
  };

  /**
   * @param {function(QueryBuilder):QueryBuilderOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.findOperationFactory = function findOperationFactory(factory) {
    this._findOperationFactory = factory;
    return this;
  };

  /**
   * @param {function(QueryBuilder):QueryBuilderOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.insertOperationFactory = function insertOperationFactory(factory) {
    this._insertOperationFactory = factory;
    return this;
  };

  /**
   * @param {function(QueryBuilder):QueryBuilderOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.updateOperationFactory = function updateOperationFactory(factory) {
    this._updateOperationFactory = factory;
    return this;
  };

  /**
   * @param {function(QueryBuilder):QueryBuilderOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.patchOperationFactory = function patchOperationFactory(factory) {
    this._patchOperationFactory = factory;
    return this;
  };

  /**
   * @param {function(QueryBuilder):QueryBuilderOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.deleteOperationFactory = function deleteOperationFactory(factory) {
    this._deleteOperationFactory = factory;
    return this;
  };

  /**
   * @param {function(QueryBuilder):QueryBuilderOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.relateOperationFactory = function relateOperationFactory(factory) {
    this._relateOperationFactory = factory;
    return this;
  };

  /**
   * @param {function(QueryBuilder):QueryBuilderOperation} factory
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.unrelateOperationFactory = function unrelateOperationFactory(factory) {
    this._unrelateOperationFactory = factory;
    return this;
  };

  /**
   * @param {string|RelationExpression} exp
   * @param {Object.<string, function(QueryBuilder)>=} filters
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.eager = function eager(exp, filters) {
    this._eagerExpression = exp || null;

    if (_lodash2.default.isString(this._eagerExpression)) {
      this._eagerExpression = _RelationExpression2.default.parse(this._eagerExpression);
    }

    if (_lodash2.default.isObject(filters)) {
      this._eagerExpression.filters = filters;
    }

    checkEager(this);
    return this;
  };

  /**
   * @param {string|RelationExpression} exp
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.allowEager = function allowEager(exp) {
    this._allowedEagerExpression = exp || null;

    if (_lodash2.default.isString(this._allowedEagerExpression)) {
      this._allowedEagerExpression = _RelationExpression2.default.parse(this._allowedEagerExpression);
    }

    checkEager(this);
    return this;
  };

  /**
   * @param {string|RelationExpression} path
   * @param {function(QueryBuilder)} modifier
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.modifyEager = function modifyEager(path, modifier) {
    this._eagerFilterExpressions.push({
      path: path,
      filter: modifier
    });

    return this;
  };

  QueryBuilder.prototype.filterEager = function filterEager() {
    return this.modifyEager.apply(this, arguments);
  };

  /**
   * @param {string|RelationExpression} exp
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.allowInsert = function allowInsert(exp) {
    this._allowedInsertExpression = exp || null;

    if (_lodash2.default.isString(this._allowedInsertExpression)) {
      this._allowedInsertExpression = _RelationExpression2.default.parse(this._allowedInsertExpression);
    }

    return this;
  };

  /**
   * @param {object} opt
   * @return {QueryBuilder}
   */


  QueryBuilder.prototype.eagerOptions = function eagerOptions(opt) {
    this._eagerOperationOptions = (0, _assign2.default)({}, this._eagerOperationOptions, opt);
    var opIdx = this.indexOfOperation(_EagerOperation2.default);

    if (opIdx !== -1) {
      this._operations[opIdx] = this._operations[opIdx].clone({
        opt: this._findOperationOptions
      });
    }

    return this;
  };

  /**
   * @param {object} opt
   * @return {QueryBuilder}
   */


  QueryBuilder.prototype.findOptions = function findOptions(opt) {
    this._findOperationOptions = (0, _assign2.default)({}, this._findOperationOptions, opt);
    var opIdx = this.indexOfOperation(_FindOperation2.default);

    if (opIdx !== -1) {
      this._operations[opIdx] = this._operations[opIdx].clone({
        opt: this._findOperationOptions
      });
    }

    return this;
  };

  /**
   * @returns {Constructor.<Model>}
   */


  QueryBuilder.prototype.modelClass = function modelClass() {
    return this._modelClass;
  };

  /**
   * @returns {boolean}
   */


  QueryBuilder.prototype.isFindQuery = function isFindQuery() {
    return !_lodash2.default.some(this._operations, function (method) {
      return method.isWriteOperation;
    }) && !this._explicitRejectValue;
  };

  /**
   * @returns {string}
   */


  QueryBuilder.prototype.toString = function toString() {
    return this.build().toString();
  };

  /**
   * @returns {string}
   */


  QueryBuilder.prototype.toSql = function toSql() {
    return this.toString();
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.clone = function clone() {
    var builder = new this.constructor(this._modelClass);
    this.baseCloneInto(builder);

    builder._explicitRejectValue = this._explicitRejectValue;
    builder._explicitResolveValue = this._explicitResolveValue;

    builder._eagerExpression = this._eagerExpression;
    builder._eagerFilterExpressions = this._eagerFilterExpressions.slice();

    builder._allowedEagerExpression = this._allowedEagerExpression;
    builder._allowedInsertExpression = this._allowedInsertExpression;

    builder._findOperationOptions = this._findOperationOptions;
    builder._eagerOperationOptions = this._eagerOperationOptions;

    builder._findOperationFactory = this._findOperationFactory;
    builder._insertOperationFactory = this._insertOperationFactory;
    builder._updateOperationFactory = this._updateOperationFactory;
    builder._patchOperationFactory = this._patchOperationFactory;
    builder._relateOperationFactory = this._relateOperationFactory;
    builder._unrelateOperationFactory = this._unrelateOperationFactory;
    builder._deleteOperationFactory = this._deleteOperationFactory;
    builder._eagerOperationFactory = this._eagerOperationFactory;

    builder.stack = this.stack;

    return builder;
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.clearEager = function clearEager() {
    this._eagerExpression = null;
    this._eagerFilterExpressions = [];
    return this;
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.clearReject = function clearReject() {
    this._explicitRejectValue = null;
    return this;
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.clearResolve = function clearResolve() {
    this._explicitResolveValue = null;
    return this;
  };

  /**
   * @param {function=} successHandler
   * @param {function=} errorHandler
   * @returns {Promise}
   */


  QueryBuilder.prototype.then = function then(successHandler, errorHandler) {
    var promise = this.execute();
    return promise.then.apply(promise, arguments);
  };

  /**
   * @param {function} mapper
   * @returns {Promise}
   */


  QueryBuilder.prototype.map = function map(mapper) {
    var promise = this.execute();
    return promise.map.apply(promise, arguments);
  };

  /**
   * @param {function} errorHandler
   * @returns {Promise}
   */


  QueryBuilder.prototype.catch = function _catch(errorHandler) {
    var promise = this.execute();
    return promise.catch.apply(promise, arguments);
  };

  /**
   * @param {*} returnValue
   * @returns {Promise}
   */


  QueryBuilder.prototype.return = function _return(returnValue) {
    var promise = this.execute();
    return promise.return.apply(promise, arguments);
  };

  /**
   * @param {*} context
   * @returns {Promise}
   */


  QueryBuilder.prototype.bind = function bind(context) {
    var promise = this.execute();
    return promise.bind.apply(promise, arguments);
  };

  /**
   * @param {function} callback
   * @returns {Promise}
   */


  QueryBuilder.prototype.asCallback = function asCallback(callback) {
    var promise = this.execute();
    return promise.asCallback.apply(promise, arguments);
  };

  /**
   * @param {function} callback
   * @returns {Promise}
   */


  QueryBuilder.prototype.nodeify = function nodeify(callback) {
    var promise = this.execute();
    return promise.nodeify.apply(promise, arguments);
  };

  /**
   * @returns {Promise}
   */


  QueryBuilder.prototype.resultSize = function resultSize() {
    var knex = this._modelClass.knex();

    // orderBy is useless here and it can make things a lot slower (at least with postgresql 9.3).
    // Remove it from the count query. We also remove the offset and limit
    var query = this.clone().clear(/orderBy|offset|limit/).build();
    var rawQuery = knex.raw(query).wrap('(', ') as temp');
    var countQuery = knex.count('* as count').from(rawQuery);

    return countQuery.then(function (result) {
      return result[0] ? result[0].count : 0;
    });
  };

  /**
   * @param {number} page
   * @param {number} pageSize
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.page = function page(_page, pageSize) {
    return this.range(_page * pageSize, (_page + 1) * pageSize - 1);
  };

  /**
   * @param {number} start
   * @param {number} end
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.range = function range(start, end) {
    var _this2 = this;

    var resultSizePromise = void 0;

    return this.limit(end - start + 1).offset(start).runBefore(function () {
      // Don't return the promise so that it is executed
      // in parallel with the actual query.
      resultSizePromise = _this2.resultSize();
    }).runAfter(function (results) {
      // Now that the actual query is finished, wait until the
      // result size has been calculated.
      return _bluebird2.default.all([results, resultSizePromise]);
    }).runAfter(function (arr) {
      return {
        results: arr[0],
        total: _lodash2.default.parseInt(arr[1])
      };
    });
  };

  /**
   * @returns {knex.QueryBuilder}
   */
  QueryBuilder.prototype.build = function build() {
    // Take a clone so that we don't modify this instance during build.
    var builder = this.clone();

    if (builder.isFindQuery()) {
      // If no write operations have been called at this point this query is a
      // find query and we need to call the custom find implementation.
      builder._callFindOperation();
    }

    if (builder._eagerExpression) {
      builder._callEagerFetchOperation();
    }

    // We need to build the builder even if a query executor operation
    // has been called so that the onBuild hooks get called.
    var knexBuilder = _build(builder);
    var queryExecutorOperation = builder._queryExecutorOperation();

    if (queryExecutorOperation) {
      // If the query executor is set, we build the builder that it returns.
      return queryExecutorOperation.queryExecutor(builder).build();
    } else {
      return knexBuilder;
    }
  };

  /**
   * @returns {Promise}
   */


  QueryBuilder.prototype.execute = function execute() {
    var stack = this.stack;

    // Take a clone so that we don't modify this instance during execution.
    var builder = this.clone();
    var promiseCtx = { builder: builder };
    var promise = _bluebird2.default.bind(promiseCtx);
    var context = builder.context() || {};
    var internalContext = builder.internalContext();

    if (builder.isFindQuery()) {
      // If no write operations have been called at this point this query is a
      // find query and we need to call the custom find implementation.
      builder._callFindOperation();
    }

    if (builder._eagerExpression) {
      builder._callEagerFetchOperation();
    }

    promise = chainBeforeOperations(promise, builder._operations);
    promise = chainHooks(promise, context.runBefore);
    promise = chainHooks(promise, internalContext.runBefore);
    promise = chainBeforeInternalOperations(promise, builder._operations);

    // Resolve all before hooks before building and executing the query
    // and the rest of the hooks.
    return promise.then(function () {
      var promiseCtx = this;
      var builder = promiseCtx.builder;

      var promise = null;
      var knexBuilder = _build(builder);
      var queryExecutorOperation = builder._queryExecutorOperation();

      if (builder._explicitRejectValue) {
        promise = _bluebird2.default.reject(builder._explicitRejectValue).bind(promiseCtx);
      } else if (builder._explicitResolveValue) {
        promise = _bluebird2.default.resolve(builder._explicitResolveValue).bind(promiseCtx);
      } else if (queryExecutorOperation) {
        promise = queryExecutorOperation.queryExecutor(builder).bind(promiseCtx);
      } else {
        (function () {
          var TIMEOUT = 10000;
          var start = Date.now();
          var interval = setInterval(function () {
            console.warn('query has been running for ' + (Date.now() - start) + ' ms. query was started from:', stack);
          }, TIMEOUT);

          promise = knexBuilder.bind(promiseCtx);
          promise = chainRawResultOperations(promise, builder._operations);
          promise = promise.then(createModels);

          promise = promise.then(function (res) {
            clearInterval(interval);
            return res;
          }).catch(function (err) {
            clearInterval(interval);
            throw err;
          });
        })();
      }

      promise = chainAfterQueryOperations(promise, builder._operations);
      promise = chainAfterInternalOperations(promise, builder._operations);
      promise = chainHooks(promise, context.runAfter);
      promise = chainHooks(promise, internalContext.runAfter);
      promise = chainAfterOperations(promise, builder._operations);

      return promise;
    });
  };

  /**
   * @private
   * @returns {QueryBuilderOperation}
   */


  QueryBuilder.prototype._queryExecutorOperation = function _queryExecutorOperation() {
    for (var i = 0, l = this._operations.length; i < l; ++i) {
      var op = this._operations[i];

      if (op.hasQueryExecutor()) {
        return op;
      }
    }

    return null;
  };

  /**
   * @private
   */


  QueryBuilder.prototype._callFindOperation = function _callFindOperation() {
    if (!this.has(_FindOperation2.default)) {
      var operation = this._findOperationFactory(this);

      operation.opt = _lodash2.default.merge(operation.opt, this._findOperationOptions);

      this.callQueryBuilderOperation(operation, [], /* pushFront = */true);
    }
  };

  /**
   * @private
   */


  QueryBuilder.prototype._callEagerFetchOperation = function _callEagerFetchOperation() {
    if (!this.has(_EagerOperation2.default) && this._eagerExpression) {
      var operation = this._eagerOperationFactory(this);

      operation.opt = _lodash2.default.merge(operation.opt, this._modelClass.defaultEagerOptions, this._eagerOperationOptions);

      this.callQueryBuilderOperation(operation, [this._eagerExpression, this._eagerFilterExpressions]);
    }
  };

  /**
   * @param {string} propertyName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.pluck = function pluck(propertyName) {
    return this.runAfter(function (result) {
      if (_lodash2.default.isArray(result)) {
        return _lodash2.default.map(result, propertyName);
      } else {
        return result;
      }
    });
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.first = function first() {
    return this.runAfter(function (result) {
      if (_lodash2.default.isArray(result)) {
        return result[0];
      } else {
        return result;
      }
    });
  };

  /**
   * @returns {boolean}
   */


  QueryBuilder.prototype.hasSelection = function hasSelection(selection) {
    var table = this.modelClass().tableName;
    var noSelectStatements = true;

    for (var i = 0, l = this._operations.length; i < l; ++i) {
      var op = this._operations[i];

      if (op instanceof _SelectOperation2.default) {
        noSelectStatements = false;

        if (op.hasSelection(table, selection)) {
          return true;
        }
      }
    }

    if (noSelectStatements) {
      // Implicit `select *`.
      return true;
    } else {
      return false;
    }
  };

  /**
   * @param {Constructor.<Model>=} modelClass
   * @param {function(Model, Model, string)} traverser
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.traverse = function traverse(modelClass, traverser) {
    var _this3 = this;

    if (_lodash2.default.isUndefined(traverser)) {
      traverser = modelClass;
      modelClass = null;
    }

    return this.runAfter(function (result) {
      _this3._modelClass.traverse(modelClass, result, traverser);
      return result;
    });
  };

  /**
   * @param {Constructor.<Model>=} modelClass
   * @param {Array.<string>} properties
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.pick = function pick(modelClass, properties) {
    if (_lodash2.default.isUndefined(properties)) {
      properties = modelClass;
      modelClass = null;
    }

    properties = _lodash2.default.reduce(properties, function (obj, prop) {
      obj[prop] = true;
      return obj;
    }, {});

    return this.traverse(modelClass, function (model) {
      model.$pick(properties);
    });
  };

  /**
   * @param {Constructor.<Model>=} modelClass
   * @param {Array.<string>} properties
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.omit = function omit(modelClass, properties) {
    if (_lodash2.default.isUndefined(properties)) {
      properties = modelClass;
      modelClass = null;
    }

    // Turn the properties into a hash for performance.
    properties = _lodash2.default.reduce(properties, function (obj, prop) {
      obj[prop] = true;
      return obj;
    }, {});

    return this.traverse(modelClass, function (model) {
      model.$omit(properties);
    });
  };

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.joinRelation = function joinRelation(relationName) {};

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.innerJoinRelation = function innerJoinRelation(relationName) {};

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.outerJoinRelation = function outerJoinRelation(relationName) {};

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.leftJoinRelation = function leftJoinRelation(relationName) {};

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.leftOuterJoinRelation = function leftOuterJoinRelation(relationName) {};

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.rightJoinRelation = function rightJoinRelation(relationName) {};

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.rightOuterJoinRelation = function rightOuterJoinRelation(relationName) {};

  /**
   * @param {string} relationName
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.fullOuterJoinRelation = function fullOuterJoinRelation(relationName) {};

  /**
   * @param {string|number|Array.<string|number>} id
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.findById = function findById(id) {
    return this.whereComposite(this._modelClass.getFullIdColumn(), id).first();
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.withSchema = function withSchema(schema) {
    this.internalContext().onBuild.push(function (builder) {
      if (!builder.has(/withSchema/)) {
        // Need to push this operation to the front because knex doesn't use the
        // schema for operations called before `withSchema`.
        builder.callKnexQueryBuilderOperation('withSchema', [schema], true);
      }
    });

    return this;
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.debug = function debug() {
    this.internalContext().onBuild.push(function (builder) {
      builder.callKnexQueryBuilderOperation('debug', []);
    });

    return this;
  };

  /**
   * @param {Object|Model|Array.<Object>|Array.<Model>} modelsOrObjects
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.insert = function insert(modelsOrObjects) {
    var insertOperation = this._insertOperationFactory(this);
    return this.callQueryBuilderOperation(insertOperation, [modelsOrObjects]);
  };

  /**
   * @param {Object|Model|Array.<Object>|Array.<Model>} modelsOrObjects
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.insertAndFetch = function insertAndFetch(modelsOrObjects) {
    var insertAndFetchOperation = new _InsertAndFetchOperation2.default(this.knex(), 'insertAndFetch', {
      delegate: this._insertOperationFactory(this)
    });

    return this.callQueryBuilderOperation(insertAndFetchOperation, [modelsOrObjects]);
  };

  /**
   * @param {Object|Model|Array.<Object>|Array.<Model>} modelsOrObjects
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.insertGraph = function insertGraph(modelsOrObjects) {
    var insertGraphOperation = new _InsertGraphOperation2.default(this.knex(), 'insertGraph', {
      delegate: this._insertOperationFactory(this)
    });

    return this.callQueryBuilderOperation(insertGraphOperation, [modelsOrObjects]);
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.insertWithRelated = function insertWithRelated() {
    return this.insertGraph.apply(this, arguments);
  };

  /**
   * @param {Object|Model|Array.<Object>|Array.<Model>} modelsOrObjects
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.insertGraphAndFetch = function insertGraphAndFetch(modelsOrObjects) {
    var insertGraphAndFetchOperation = new _InsertGraphAndFetchOperation2.default(this.knex(), 'insertGraphAndFetch', {
      delegate: new _InsertGraphOperation2.default(this.knex(), 'insertGraph', {
        delegate: this._insertOperationFactory(this)
      })
    });

    return this.callQueryBuilderOperation(insertGraphAndFetchOperation, [modelsOrObjects]);
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.insertWithRelatedAndFetch = function insertWithRelatedAndFetch() {
    return this.insertGraphAndFetch.apply(this, arguments);
  };

  /**
   * @param {Model|Object=} modelOrObject
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.update = function update(modelOrObject) {
    var updateOperation = this._updateOperationFactory(this);
    return this.callQueryBuilderOperation(updateOperation, [modelOrObject]);
  };

  /**
   * @param {Model|Object=} modelOrObject
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.updateAndFetch = function updateAndFetch(modelOrObject) {
    var delegateOperation = this._updateOperationFactory(this);

    if (!(delegateOperation.instance instanceof this._modelClass)) {
      throw new Error('updateAndFetch can only be called for instance operations');
    }

    var updateAndFetch = new _UpdateAndFetchOperation2.default(this.knex(), 'updateAndFetch', {
      delegate: delegateOperation
    });

    return this.callQueryBuilderOperation(updateAndFetch, [delegateOperation.instance.$id(), modelOrObject]);
  };

  /**
   * @param {number|string|Array.<number|string>} id
   * @param {Model|Object=} modelOrObject
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.updateAndFetchById = function updateAndFetchById(id, modelOrObject) {
    var updateAndFetch = new _UpdateAndFetchOperation2.default(this.knex(), 'updateAndFetch', {
      delegate: this._updateOperationFactory(this)
    });

    return this.callQueryBuilderOperation(updateAndFetch, [id, modelOrObject]);
  };

  /**
   * @param {Model|Object=} modelOrObject
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.patch = function patch(modelOrObject) {
    var patchOperation = this._patchOperationFactory(this);
    return this.callQueryBuilderOperation(patchOperation, [modelOrObject]);
  };

  /**
   * @param {Model|Object=} modelOrObject
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.patchAndFetch = function patchAndFetch(modelOrObject) {
    var delegateOperation = this._patchOperationFactory(this);

    if (!(delegateOperation.instance instanceof this._modelClass)) {
      throw new Error('patchAndFetch can only be called for instance operations');
    }

    var patchAndFetch = new _UpdateAndFetchOperation2.default(this.knex(), 'patchAndFetch', {
      delegate: delegateOperation
    });

    return this.callQueryBuilderOperation(patchAndFetch, [delegateOperation.instance.$id(), modelOrObject]);
  };

  /**
   * @param {number|string|Array.<number|string>} id
   * @param {Model|Object=} modelOrObject
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.patchAndFetchById = function patchAndFetchById(id, modelOrObject) {
    var patchAndFetch = new _UpdateAndFetchOperation2.default(this.knex(), 'patchAndFetch', {
      delegate: this._patchOperationFactory(this)
    });

    return this.callQueryBuilderOperation(patchAndFetch, [id, modelOrObject]);
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.delete = function _delete() {
    var deleteOperation = this._deleteOperationFactory(this);
    return this.callQueryBuilderOperation(deleteOperation, []);
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.del = function del() {
    return this.delete();
  };

  /**
   * @param {number|string|Array.<number|string>} id
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.deleteById = function deleteById(id) {
    return this.delete().whereComposite(this._modelClass.getFullIdColumn(), id);
  };

  /**
   * @param {number|string|object|Array.<number|string>|Array.<Array.<number|string>>|Array.<object>} ids
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.relate = function relate(ids) {
    var relateOperation = this._relateOperationFactory(this);
    return this.callQueryBuilderOperation(relateOperation, [ids]);
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.unrelate = function unrelate() {
    var unrelateOperation = this._unrelateOperationFactory(this);
    return this.callQueryBuilderOperation(unrelateOperation, []);
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.increment = function increment(propertyName, howMuch) {
    var patch = {};
    var columnName = this._modelClass.propertyNameToColumnName(propertyName);
    patch[propertyName] = this._modelClass.knex().raw('?? + ?', [columnName, howMuch]);
    return this.patch(patch);
  };

  /**
   * @returns {QueryBuilder}
   */


  QueryBuilder.prototype.decrement = function decrement(propertyName, howMuch) {
    var patch = {};
    var columnName = this._modelClass.propertyNameToColumnName(propertyName);
    patch[propertyName] = this._modelClass.knex().raw('?? - ?', [columnName, howMuch]);
    return this.patch(patch);
  };

  return QueryBuilder;
}(_QueryBuilderBase3.default), (_applyDecoratedDescriptor(_class.prototype, 'runBefore', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'runBefore'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'onBuild', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'onBuild'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'runAfter', [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'runAfter'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'joinRelation', [_dec4], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'joinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'innerJoinRelation', [_dec5], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'innerJoinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'outerJoinRelation', [_dec6], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'outerJoinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'leftJoinRelation', [_dec7], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'leftJoinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'leftOuterJoinRelation', [_dec8], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'leftOuterJoinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'rightJoinRelation', [_dec9], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'rightJoinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'rightOuterJoinRelation', [_dec10], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'rightOuterJoinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fullOuterJoinRelation', [_dec11], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fullOuterJoinRelation'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'insert', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'insert'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'insertAndFetch', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'insertAndFetch'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'insertGraph', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'insertGraph'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'insertGraphAndFetch', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'insertGraphAndFetch'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'update', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'update'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'updateAndFetch', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'updateAndFetch'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'updateAndFetchById', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'updateAndFetchById'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'patch', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'patch'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'patchAndFetch', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'patchAndFetch'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'patchAndFetchById', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'patchAndFetchById'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'delete', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'delete'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'relate', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'relate'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'unrelate', [writeQueryOperation], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'unrelate'), _class.prototype)), _class));
exports.default = QueryBuilder;


function writeQueryOperation(target, property, descriptor) {
  var func = descriptor.value;

  descriptor.value = function decorator$writeQueryOperation() {
    if (!this.isFindQuery()) {
      return this.reject(new Error('Double call to a write method. ' + 'You can only call one of the write methods ' + '(insert, update, patch, delete, relate, unrelate, increment, decrement) ' + 'and only once per query builder.'));
    }

    try {
      func.apply(this, arguments);
    } catch (err) {
      this.reject(err);
    }

    return this;
  };
}

function checkEager(builder) {
  if (builder._eagerExpression && builder._allowedEagerExpression) {
    if (!builder._allowedEagerExpression.isSubExpression(builder._eagerExpression)) {
      builder.reject(new _ValidationError2.default({ eager: 'eager expression not allowed' }));
    }
  }
}

function createModels(result) {
  var builder = this.builder;

  if (result === null || result === undefined) {
    return null;
  }

  if (Array.isArray(result)) {
    if (result.length && (0, _typeof3.default)(result[0]) === 'object' && !(result[0] instanceof builder._modelClass)) {
      for (var i = 0, l = result.length; i < l; ++i) {
        result[i] = builder._modelClass.fromDatabaseJson(result[i]);
      }
    }
  } else if ((typeof result === 'undefined' ? 'undefined' : (0, _typeof3.default)(result)) === 'object' && !(result instanceof builder._modelClass)) {
    result = builder._modelClass.fromDatabaseJson(result);
  }

  return result;
}

function _build(builder) {
  var context = builder.context() || {};
  var internalContext = builder.internalContext();
  var knexBuilder = builder.knex().queryBuilder();

  callOnBuildHooks(builder, context.onBuild);
  callOnBuildHooks(builder, internalContext.onBuild);

  knexBuilder = builder.buildInto(knexBuilder);

  if (!builder.has(/from|table|into/)) {
    // Set the table only if it hasn't been explicitly set yet.
    knexBuilder.table(builder.modelClass().tableName);
  }

  return knexBuilder;
}

function chainHooks(promise, func) {
  if (_lodash2.default.isFunction(func)) {
    promise = promise.then(function (result) {
      return func.call(this.builder, result, this.builder);
    });
  } else if (Array.isArray(func)) {
    func.forEach(function (func) {
      promise = promise.then(function (result) {
        return func.call(this.builder, result, this.builder);
      });
    });
  }

  return promise;
}

function callOnBuildHooks(builder, func) {
  if (_lodash2.default.isFunction(func)) {
    func.call(builder, builder);
  } else if (_lodash2.default.isArray(func)) {
    for (var i = 0, l = func.length; i < l; ++i) {
      func[i].call(builder, builder);
    }
  }
}

function createHookCaller(hook) {
  var hasMethod = 'has' + _lodash2.default.upperFirst(hook);

  // Compile the caller function for (measured) performance boost.
  var caller = new Function('promise', 'op', '\n    if (op.' + hasMethod + '()) {\n      return promise.then(function (result) {\n        return op.' + hook + '(this.builder, result);\n      });\n    } else {\n      return promise;\n    }\n  ');

  return function (promise, operations) {
    for (var i = 0, l = operations.length; i < l; ++i) {
      promise = caller(promise, operations[i]);
    }

    return promise;
  };
}

function createOperationFactory(OperationClass, name, options) {
  return function (builder) {
    return new OperationClass(builder.knex(), name, options);
  };
}

var chainBeforeOperations = createHookCaller('onBefore');
var chainBeforeInternalOperations = createHookCaller('onBeforeInternal');
var chainRawResultOperations = createHookCaller('onRawResult');
var chainAfterQueryOperations = createHookCaller('onAfterQuery');
var chainAfterInternalOperations = createHookCaller('onAfterInternal');
var chainAfterOperations = createHookCaller('onAfter');

var findOperationFactory = createOperationFactory(_FindOperation2.default, 'find');
var insertOperationFactory = createOperationFactory(_InsertOperation2.default, 'insert');
var updateOperationFactory = createOperationFactory(_UpdateOperation2.default, 'update');
var patchOperationFactory = createOperationFactory(_UpdateOperation2.default, 'patch', { modelOptions: { patch: true } });
var relateOperationFactory = createOperationFactory(_QueryBuilderOperation2.default, 'relate');
var unrelateOperationFactory = createOperationFactory(_QueryBuilderOperation2.default, 'unrelate');
var deleteOperationFactory = createOperationFactory(_DeleteOperation2.default, 'delete');