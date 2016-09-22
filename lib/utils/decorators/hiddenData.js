'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = hiddenData;

var _hiddenData = require('../hiddenData');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hiddenData(opt) {
  return function (target, property, descriptor) {
    var propName = void 0;
    var append = void 0;

    if ((typeof opt === 'undefined' ? 'undefined' : (0, _typeof3.default)(opt)) === 'object') {
      propName = opt.name || property;
      append = !!opt.append;
    } else {
      propName = opt || property;
      append = false;
    }

    var get = (0, _hiddenData.createGetter)(propName);
    var set = (0, _hiddenData.createSetter)(propName);

    if (typeof descriptor.value === 'function') {
      if (append) {
        descriptor.value = function decorator$hiddenData() {
          if (arguments.length === 0) {
            return get(this);
          } else {
            return appendSet(this, arguments[0], get, set);
          }
        };
      } else {
        descriptor.value = function decorator$hiddenData() {
          if (arguments.length === 0) {
            return get(this);
          } else {
            set(this, arguments[0]);
          }
        };
      }
    }

    if (typeof descriptor.get === 'function') {
      descriptor.get = function decorator$hiddenDataGetter() {
        return get(this);
      };
    }

    if (typeof descriptor.set === 'function') {
      descriptor.set = function decorator$hiddenDataSetter(value) {
        return set(this, value);
      };
    }
  };
}

function appendSet(self, value, get, set) {
  var data = get(self);

  if (Array.isArray(data) && Array.isArray(value)) {
    for (var i = 0, l = value.length; i < l; ++i) {
      data.push(value[i]);
    }
  } else {
    set(self, value);
  }
}