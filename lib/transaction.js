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
    var args = _lodash2.default.toArray(arguments);
    var knex = _lodash2.default.first(args);
    args = args.slice(1);

    // If the function is a generator, wrap it using Promise.coroutine.
    if (isGenerator(args[0])) {
      args[0] = _bluebird2.default.coroutine(args[0]);
    }

    return knex.transaction.apply(knex, args);
  } else {
    var _ret = function () {
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
        })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
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

transaction.debug = function () {
  var TIMEOUT = 10000;
  var stack = new Error().stack;
  var start = Date.now();
  var interval = setInterval(function () {
    console.warn('transaction has been running for ' + (Date.now() - start) + ' MS. transaction was started from:', stack);
  }, TIMEOUT);

  return transaction.apply(undefined, arguments).then(function (res) {
    clearInterval(interval);
    return res;
  }).catch(function (err) {
    clearInterval(interval);
    throw err;
  });
};

function isGenerator(fn) {
  return fn && fn.constructor && fn.constructor.name === 'GeneratorFunction';
}