'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.isPromise = isPromise;
exports.after = after;
exports.afterReturn = afterReturn;
exports.mapAfterAllReturn = mapAfterAllReturn;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isPromise(obj) {
  return obj && (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' && typeof obj.then === 'function';
}

function after(obj, func) {
  if (isPromise(obj)) {
    return obj.then(func);
  } else {
    return func(obj);
  }
}

function afterReturn(obj, returnValue) {
  if (obj instanceof _bluebird2.default) {
    return obj.return(returnValue);
  } else if (isPromise(obj)) {
    return obj.then(function () {
      return returnValue;
    });
  } else {
    return returnValue;
  }
}

function mapAfterAllReturn(arr, mapper, returnValue) {
  var results = new Array(arr.length);
  var containsPromise = false;

  for (var i = 0, l = arr.length; i < l; ++i) {
    results[i] = mapper(arr[i]);

    if (isPromise(results[i])) {
      containsPromise = true;
    }
  }

  if (containsPromise) {
    return _bluebird2.default.all(results).return(returnValue);
  } else {
    return returnValue;
  }
}