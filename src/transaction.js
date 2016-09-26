import _ from 'lodash';
import Promise from 'bluebird';
import Model from './model/Model';
import {isSubclassOf} from './utils/classUtils';

let _id = 1;
const TIMEOUT = 10000;

function logPool(knex) {
  if (knex && typeof knex.client === 'object' && typeof knex.client.pool === 'object' && typeof knex.client.pool._waitingClients === 'object') {
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
export default function transaction() {
  // There must be at least one model class and the callback.
  if (arguments.length < 2) {
    return Promise.reject(new Error('objection.transaction: provide at least one Model class to bind to the transaction or a knex instance'));
  }

  if (!isSubclassOf(arguments[0], Model) && _.isFunction(arguments[0].transaction)) {
    let args = _.toArray(arguments);
    let knex = _.first(args);
    args = args.slice(1);

    const id = _id++;
    const stack = new Error().stack;
    const start = Date.now();
    let timeout = false;

    const interval = setInterval(() => {
      timeout = true;
      console.warn(`transaction ${id} has been running for ${Date.now() - start} ms. transaction was started from:`, stack);
      logPool(knex);
    }, TIMEOUT);

    // If the function is a generator, wrap it using Promise.coroutine.
    if (isGenerator(args[0])) {
      args[0] = Promise.coroutine(args[0]);
    }

    return Promise.resolve().then(() => {
      return knex.transaction.apply(knex, args);
    }).then((res) => {
      clearInterval(interval);
      if (timeout) {
        console.warn(`transaction ${id} finally succeeded after ${Date.now() - start} ms`);
        logPool(knex);
      }
      return res;
    }).catch((err) => {
      clearInterval(interval);
      if (timeout) {
        console.warn(`transaction ${id} failed after ${Date.now() - start} ms`, err.stack);
        logPool(knex);
      }
      throw err;
    });
  } else {
    // The last argument should be the callback and all other Model subclasses.
    let callback = _.last(arguments);
    let modelClasses = _.take(arguments, arguments.length - 1);
    let i;

    for (i = 0; i < modelClasses.length; ++i) {
      if (!isSubclassOf(modelClasses[i], Model)) {
        return Promise.reject(new Error('objection.transaction: all but the last argument should be Model subclasses'));
      }
    }

    let knex = _.first(modelClasses).knex();
    for (i = 0; i < modelClasses.length; ++i) {
      if (modelClasses[i].knex() !== knex) {
        return Promise.reject(new Error('objection.transaction: all Model subclasses must be bound to the same database'));
      }
    }

    // If the function is a generator, wrap it using Promise.coroutine.
    if (isGenerator(callback)) {
      callback = Promise.coroutine(callback);
    }

    const id = _id++;
    const stack = new Error().stack;
    const start = Date.now();
    let timeout = false;

    const interval = setInterval(() => {
      timeout = true;
      console.warn(`transaction ${id} has been running for ${Date.now() - start} ms. transaction was started from:`, stack);
      logPool(knex);
    }, TIMEOUT);

    return knex.transaction(trx => {
      let args = new Array(modelClasses.length + 1);

      for (let i = 0; i < modelClasses.length; ++i) {
        args[i] = modelClasses[i].bindTransaction(trx);
      }

      args[args.length - 1] = trx;

      return Promise.try(() => {
        return callback.apply(trx, args);
      });
    }).then((res) => {
      clearInterval(interval);
      if (timeout) {
        console.warn(`transaction ${id} finally succeeded after ${Date.now() - start} ms`);
        logPool(knex);
      }
      return res;
    }).catch((err) => {
      clearInterval(interval);
      if (timeout) {
        console.warn(`transaction ${id} failed after ${Date.now() - start} ms`, err.stack);
        logPool(knex);
      }
      throw err;
    });
  }
}

/**
 * @param {Constructor.<Model>|knex} modelClassOrKnex
 * @returns {Promise}
 */
transaction.start = function (modelClassOrKnex) {
  let knex = modelClassOrKnex;

  if (isSubclassOf(modelClassOrKnex, Model)) {
    knex = modelClassOrKnex.knex();
  }

  if (!_.isFunction(knex.transaction)) {
    return Promise.reject(new Error('objection.transaction.start: first argument must be a model class or a knex instance'));
  }

  return new Promise((resolve, reject) => {
    knex.transaction(trx => {
      resolve(trx);
    }).catch(err => {
      reject(err);
    });
  });
};

function isGenerator(fn) {
  return fn && fn.constructor && fn.constructor.name === 'GeneratorFunction';
}
