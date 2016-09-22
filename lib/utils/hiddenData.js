'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.init = init;
exports.createGetter = createGetter;
exports.createSetter = createSetter;
exports.inheritHiddenData = inheritHiddenData;
exports.copyHiddenData = copyHiddenData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HIDDEN_DATA = '$$hiddenData';

function init(obj, data) {
  (0, _defineProperty2.default)(obj, HIDDEN_DATA, {
    enumerable: false,
    writable: true,
    value: data || (0, _create2.default)(null)
  });
}

function createGetter(propName) {
  return new Function('obj', '\n    if (obj.hasOwnProperty("' + HIDDEN_DATA + '")) {\n      return obj.' + HIDDEN_DATA + '.' + propName + ';\n    } else {\n      return undefined;\n    }\n  ');
}

function createSetter(propName) {
  return new Function('obj', 'data', '\n    if (!obj.hasOwnProperty("' + HIDDEN_DATA + '")) {\n      Object.defineProperty(obj, "' + HIDDEN_DATA + '", {\n        enumerable: false,\n        writable: true,\n        value: Object.create(null)\n      });\n    }\n\n    obj.' + HIDDEN_DATA + '.' + propName + ' = data;\n  ');
}

function inheritHiddenData(src, dst) {
  init(dst, (0, _create2.default)(src[HIDDEN_DATA] || null));
}

function copyHiddenData(src, dst) {
  init(dst, src[HIDDEN_DATA]);
}