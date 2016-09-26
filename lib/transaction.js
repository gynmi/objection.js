'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = transaction;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Model = require('./model/Model');

var _Model2 = _interopRequireDefault(_Model);

var _classUtils = require('./utils/classUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _id = 1;
var TIMEOUT = 10000;

function logPool(knex) {
  if (knex && (0, _typeof3.default)(knex.client) === 'object' && (0, _typeof3.default)(knex.client.pool) === 'object' && (0, _typeof3.default)(knex.client.pool._waitingClients) === 'object') {
    console.warn('pool:', {
      "inUseObjects.length": knex.client.pool._inUseObjects.length,
      "availableObjects.length": knex.client.pool._availableObjects.length,
      "waitingClients.size": knex.client.pool._waitingClients._size,
      "waitingClients.total": knex.client.pool._waitingClients._total
    });
  } else {
    console.warn('pool: undefined');
  }
}

/**
 * @returns {Promise}
 */
function transaction() {
  var _arguments = arguments;

  // There must be at least one model class and the callback.
  if (arguments.length < 2) {
    return _bluebird2.default.reject(new Error('objection.transaction: provide at least one Model class to bind to the transaction or a knex instance'));
  }

  if (!(0, _classUtils.isSubclassOf)(arguments[0], _Model2.default) && _lodash2.default.isFunction(arguments[0].transaction)) {
    var _ret = function () {
      var args = _lodash2.default.toArray(_arguments);
      var knex = _lodash2.default.first(args);
      args = args.slice(1);

      var id = _id++;
      var stack = new Error().stack;
      var start = Date.now();
      var timeout = false;

      var interval = setInterval(function () {
        timeout = true;
        console.warn('transaction ' + id + ' has been running for ' + (Date.now() - start) + ' ms. transaction was started from:', stack);
        logPool(knex);
      }, TIMEOUT);

      // If the function is a generator, wrap it using Promise.coroutine.
      if (isGenerator(args[0])) {
        args[0] = _bluebird2.default.coroutine(args[0]);
      }

      return {
        v: _bluebird2.default.resolve().then(function () {
          return knex.transaction.apply(knex, args);
        }).then(function (res) {
          clearInterval(interval);
          if (timeout) {
            console.warn('transaction ' + id + ' finally succeeded after ' + (Date.now() - start) + ' ms');
            logPool(knex);
          }
          return res;
        }).catch(function (err) {
          clearInterval(interval);
          if (timeout) {
            console.warn('transaction ' + id + ' failed after ' + (Date.now() - start) + ' ms', err.stack);
            logPool(knex);
          }
          throw err;
        })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
  } else {
    var _ret2 = function () {
      // The last argument should be the callback and all other Model subclasses.
      var callback = _lodash2.default.last(_arguments);
      var modelClasses = _lodash2.default.take(_arguments, _arguments.length - 1);
      var i = void 0;

      for (i = 0; i < modelClasses.length; ++i) {
        if (!(0, _classUtils.isSubclassOf)(modelClasses[i], _Model2.default)) {
          return {
            v: _bluebird2.default.reject(new Error('objection.transaction: all but the last argument should be Model subclasses'))
          };
        }
      }

      var knex = _lodash2.default.first(modelClasses).knex();
      for (i = 0; i < modelClasses.length; ++i) {
        if (modelClasses[i].knex() !== knex) {
          return {
            v: _bluebird2.default.reject(new Error('objection.transaction: all Model subclasses must be bound to the same database'))
          };
        }
      }

      // If the function is a generator, wrap it using Promise.coroutine.
      if (isGenerator(callback)) {
        callback = _bluebird2.default.coroutine(callback);
      }

      var id = _id++;
      var stack = new Error().stack;
      var start = Date.now();
      var timeout = false;

      var interval = setInterval(function () {
        timeout = true;
        console.warn('transaction ' + id + ' has been running for ' + (Date.now() - start) + ' ms. transaction was started from:', stack);
        logPool(knex);
      }, TIMEOUT);

      return {
        v: knex.transaction(function (trx) {
          var args = new Array(modelClasses.length + 1);

          for (var _i = 0; _i < modelClasses.length; ++_i) {
            args[_i] = modelClasses[_i].bindTransaction(trx);
          }

          args[args.length - 1] = trx;

          return _bluebird2.default.try(function () {
            return callback.apply(trx, args);
          });
        }).then(function (res) {
          clearInterval(interval);
          if (timeout) {
            console.warn('transaction ' + id + ' finally succeeded after ' + (Date.now() - start) + ' ms');
            logPool(knex);
          }
          return res;
        }).catch(function (err) {
          clearInterval(interval);
          if (timeout) {
            console.warn('transaction ' + id + ' failed after ' + (Date.now() - start) + ' ms', err.stack);
            logPool(knex);
          }
          throw err;
        })
      };
    }();

    if ((typeof _ret2 === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret2)) === "object") return _ret2.v;
  }
}

/**
 * @param {Constructor.<Model>|knex} modelClassOrKnex
 * @returns {Promise}
 */
transaction.start = function (modelClassOrKnex) {
  var knex = modelClassOrKnex;

  if ((0, _classUtils.isSubclassOf)(modelClassOrKnex, _Model2.default)) {
    knex = modelClassOrKnex.knex();
  }

  if (!_lodash2.default.isFunction(knex.transaction)) {
    return _bluebird2.default.reject(new Error('objection.transaction.start: first argument must be a model class or a knex instance'));
  }

  return new _bluebird2.default(function (resolve, reject) {
    knex.transaction(function (trx) {
      resolve(trx);
    }).catch(function (err) {
      reject(err);
    });
  });
};

function isGenerator(fn) {
  return fn && fn.constructor && fn.constructor.name === 'GeneratorFunction';
}