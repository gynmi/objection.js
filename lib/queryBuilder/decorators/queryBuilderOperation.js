'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = queryBuilderOperation;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dbUtils = require('../../utils/dbUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queryBuilderOperation(input, name) {
  var normalizedInput = normalizeInput(input);

  return function (target, property, descriptor) {
    var operationName = name || property;

    if (_lodash2.default.isFunction(input) || _lodash2.default.isArray(input)) {
      descriptor.value = function decorator$queryBuilderOperation() {
        var args = new Array(arguments.length);

        // Don't turn this into a function. This needs to be inline for V8 to optimize this.
        for (var i = 0, l = arguments.length; i < l; ++i) {
          args[i] = arguments[i];
        }

        var methodDesc = normalizedInput.default;
        var method = new methodDesc.operationClass(this.knex(), operationName, methodDesc.opt);

        return this.callQueryBuilderOperation(method, args);
      };
    } else {
      descriptor.value = function decorator$queryBuilderOperationWithDialect() {
        var args = new Array(arguments.length);

        // Don't turn this into a function. This needs to be inline for V8 to optimize this.
        for (var i = 0, l = arguments.length; i < l; ++i) {
          args[i] = arguments[i];
        }

        var dialect = (0, _dbUtils.getDialect)(this.knex());
        var methodDesc = normalizedInput[dialect] || normalizedInput.default;
        var method = new methodDesc.operationClass(this.knex(), operationName, methodDesc.opt);

        return this.callQueryBuilderOperation(method, args);
      };
    }
  };
}

function normalizeInput(input) {
  if (_lodash2.default.isFunction(input) || _lodash2.default.isArray(input)) {
    return {
      default: normalizeQueryOperationDesc(input)
    };
  } else {
    return _lodash2.default.mapValues(input, normalizeQueryOperationDesc);
  }
}

function normalizeQueryOperationDesc(desc) {
  if (_lodash2.default.isArray(desc)) {
    return {
      operationClass: desc[0],
      opt: desc[1]
    };
  } else {
    return {
      operationClass: desc,
      opt: {}
    };
  }
}