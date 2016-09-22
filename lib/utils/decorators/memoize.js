'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

exports.default = memoize;

var _upperFirst = require('lodash/upperFirst');

var _upperFirst2 = _interopRequireDefault(_upperFirst);

var _hiddenData = require('../hiddenData');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function memoize(target, property, descriptor) {
  var cacheProp = 'memoized' + (0, _upperFirst2.default)(property);
  var impl = descriptor.value;

  if (impl.length === 0) {
    descriptor.value = createSingleValueMemoizedFunc(impl, cacheProp);
  } else {
    descriptor.value = createMultiValueMemoizedFunc(impl, cacheProp);
  }
}

function createSingleValueMemoizedFunc(impl, cacheProp) {
  var get = (0, _hiddenData.createGetter)(cacheProp);
  var set = (0, _hiddenData.createSetter)(cacheProp);

  return function decorator$memoize() {
    var value = get(this);

    if (value === undefined) {
      value = impl.call(this);
      set(this, value);
    }

    return value;
  };
}

function createMultiValueMemoizedFunc(impl, cacheProp) {
  var get = (0, _hiddenData.createGetter)(cacheProp);
  var set = (0, _hiddenData.createSetter)(cacheProp);

  return function decorator$memoize(input) {
    var cache = get(this);

    if (cache === undefined) {
      cache = (0, _create2.default)(null);
      set(this, cache);
    }

    if (input in cache) {
      return cache[input];
    } else {
      var value = impl.call(this, input);
      cache[input] = value;
      return value;
    }
  };
}