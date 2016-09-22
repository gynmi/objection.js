'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = normalizeIds;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeIds(ids, expectedProperties, opt) {
  opt = opt || {};

  if (!_lodash2.default.isArray(expectedProperties)) {
    throw new Error('expected expectedProperties to be an array, got ' + expectedProperties);
  }

  if (expectedProperties.length === 0) {
    throw new Error('expectedProperties must not be empty');
  }

  var isComposite = expectedProperties.length > 1;
  var ret = void 0;

  if (isComposite) {
    // For composite ids these are okay:
    //
    // 1. [1, 'foo', 4]
    // 2. {a: 1, b: 'foo', c: 4}
    // 3. [[1, 'foo', 4], [4, 'bar', 1]]
    // 4. [{a: 1, b: 'foo', c: 4}, {a: 4, b: 'bar', c: 1}]
    //
    if (Array.isArray(ids)) {
      if (Array.isArray(ids[0])) {
        ret = new Array(ids.length);

        // 3.
        for (var i = 0, l = ids.length; i < l; ++i) {
          ret[i] = convertIdArrayToObject(ids[i], expectedProperties);
        }
      } else if (_lodash2.default.isObject(ids[0])) {
        ret = new Array(ids.length);

        // 4.
        for (var _i = 0, _l = ids.length; _i < _l; ++_i) {
          ret[_i] = ensureObject(ids[_i], expectedProperties);
        }
      } else {
        // 1.
        ret = [convertIdArrayToObject(ids, expectedProperties)];
      }
    } else if (_lodash2.default.isObject(ids)) {
      // 2.
      ret = [ids];
    } else {
      throw new Error('invalid composite key ' + (0, _stringify2.default)(ids));
    }
  } else {
    // For non-composite ids, these are okay:
    //
    // 1. 1
    // 2. {id: 1}
    // 3. [1, 'foo', 4]
    // 4. [{id: 1}, {id: 'foo'}, {id: 4}]
    //
    if (_lodash2.default.isArray(ids)) {
      if (_lodash2.default.isObject(ids[0])) {
        ret = new Array(ids.length);

        // 4.
        for (var _i2 = 0, _l2 = ids.length; _i2 < _l2; ++_i2) {
          ret[_i2] = ensureObject(ids[_i2]);
        }
      } else {
        ret = new Array(ids.length);

        // 3.
        for (var _i3 = 0, _l3 = ids.length; _i3 < _l3; ++_i3) {
          ret[_i3] = (0, _defineProperty3.default)({}, expectedProperties[0], ids[_i3]);
        }
      }
    } else if (_lodash2.default.isObject(ids)) {
      // 2.
      ret = [ids];
    } else {
      // 1.
      ret = [(0, _defineProperty3.default)({}, expectedProperties[0], ids)];
    }
  }

  checkProperties(ret, expectedProperties);

  if (opt.arrayOutput) {
    return normalizedToArray(ret, expectedProperties);
  } else {
    return ret;
  }
};

function convertIdArrayToObject(ids, expectedProperties) {
  if (!Array.isArray(ids)) {
    throw new Error('invalid composite key ' + (0, _stringify2.default)(ids));
  }

  if (ids.length != expectedProperties.length) {
    throw new Error('composite identifier ' + (0, _stringify2.default)(ids) + ' should have ' + expectedProperties.length + ' values');
  }

  return _lodash2.default.zipObject(expectedProperties, ids);
}

function ensureObject(ids) {
  if (_lodash2.default.isObject(ids)) {
    return ids;
  } else {
    throw new Error('invalid composite key ' + (0, _stringify2.default)(ids));
  }
}

function checkProperties(ret, expectedProperties) {
  for (var i = 0, l = ret.length; i < l; ++i) {
    var obj = ret[i];

    for (var j = 0, lp = expectedProperties.length; j < lp; ++j) {
      var prop = expectedProperties[j];

      if (typeof obj[prop] === 'undefined') {
        throw new Error('expected id ' + (0, _stringify2.default)(obj) + ' to have property ' + prop);
      }
    }
  }
}

function normalizedToArray(ret, expectedProperties) {
  var arr = new Array(ret.length);

  for (var i = 0, l = ret.length; i < l; ++i) {
    var obj = ret[i];
    var ids = new Array(expectedProperties.length);

    for (var j = 0, lp = expectedProperties.length; j < lp; ++j) {
      var prop = expectedProperties[j];
      ids[j] = obj[prop];
    }

    arr[i] = ids;
  }

  return arr;
}