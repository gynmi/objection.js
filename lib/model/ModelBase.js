'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys2 = require('babel-runtime/core-js/object/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _dec, _dec2, _dec3, _desc, _value, _class, _class2, _temp;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _hiddenData = require('../utils/decorators/hiddenData');

var _hiddenData2 = _interopRequireDefault(_hiddenData);

var _ValidationError = require('../ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _splitQueryProps = require('../utils/splitQueryProps');

var _splitQueryProps2 = _interopRequireDefault(_splitQueryProps);

var _classUtils = require('../utils/classUtils');

var _memoize = require('../utils/decorators/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

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

var ajv = new _ajv2.default({ allErrors: true, validateSchema: false, ownProperties: true });
var ajvCache = (0, _create2.default)(null);

/**
 * @typedef {Object} ModelOptions
 *
 * @property {boolean} [patch]
 * @property {boolean} [skipValidation]
 * @property {Model} [old]
 */

var ModelBase = (_dec = (0, _hiddenData2.default)({ name: 'omitFromJson', append: true }), _dec2 = (0, _hiddenData2.default)({ name: 'omitFromDatabaseJson', append: true }), _dec3 = (0, _hiddenData2.default)('stashedQueryProps'), (_class = (_temp = _class2 = function () {
  function ModelBase() {
    (0, _classCallCheck3.default)(this, ModelBase);
  }

  /**
   * @param {Object} jsonSchema
   * @param {Object} json
   * @param {ModelOptions=} options
   * @return {Object}
   */


  /**
   * @type {Object}
   */
  ModelBase.prototype.$beforeValidate = function $beforeValidate(jsonSchema, json, options) {
    /* istanbul ignore next */
    return jsonSchema;
  };

  /**
   * @param {Object=} json
   * @param {ModelOptions=} options
   * @throws {ValidationError}
   * @return {Object}
   */


  /**
   * @type {Array.<string>}
   */


  ModelBase.prototype.$validate = function $validate() {
    var json = arguments.length <= 0 || arguments[0] === undefined ? this : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var jsonSchema = this.constructor.getJsonSchema();

    if (!jsonSchema || options.skipValidation) {
      return json;
    }

    // No need to call $beforeValidate (and clone the jsonSchema) if $beforeValidate has not been overwritten.
    if (this.$beforeValidate !== ModelBase.prototype.$beforeValidate) {
      jsonSchema = _lodash2.default.cloneDeep(jsonSchema);
      jsonSchema = this.$beforeValidate(jsonSchema, json, options);
    }

    var validator = this.constructor.getJsonSchemaValidator(jsonSchema, options.patch);
    validator(json);

    if (validator.errors) {
      throw parseValidationError(validator.errors);
    }

    this.$afterValidate(json, options);
    return json;
  };

  /**
   * @param {Object=} json
   * @param {ModelOptions=} options
   */


  ModelBase.prototype.$afterValidate = function $afterValidate(json, options) {}
  // Do nothing by default.


  /**
   * @param {Object} json
   * @return {Object}
   */
  ;

  ModelBase.prototype.$parseDatabaseJson = function $parseDatabaseJson(json) {
    return json;
  };

  /**
   * @param {Object} json
   * @return {Object}
   */


  ModelBase.prototype.$formatDatabaseJson = function $formatDatabaseJson(json) {
    return json;
  };

  /**
   * @param {Object} json
   * @param {ModelOptions=} options
   * @return {Object}
   */


  ModelBase.prototype.$parseJson = function $parseJson(json, options) {
    return json;
  };

  /**
   * @param {Object} json
   * @return {Object}
   */


  ModelBase.prototype.$formatJson = function $formatJson(json) {
    return json;
  };

  /**
   * @return {Object}
   */


  ModelBase.prototype.$toDatabaseJson = function $toDatabaseJson() {
    return this.$$toJson(true, null, null);
  };

  /**
   * @return {Object}
   */


  ModelBase.prototype.$toJson = function $toJson() {
    return this.$$toJson(false, null, null);
  };

  ModelBase.prototype.toJSON = function toJSON() {
    return this.$toJson();
  };

  /**
   * @param {Object} json
   * @param {ModelOptions=} options
   * @returns {ModelBase}
   * @throws ValidationError
   */


  ModelBase.prototype.$setJson = function $setJson(json) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    json = json || {};

    if (!_lodash2.default.isObject(json) || _lodash2.default.isString(json) || _lodash2.default.isNumber(json) || _lodash2.default.isDate(json) || _lodash2.default.isArray(json) || _lodash2.default.isFunction(json) || _lodash2.default.isTypedArray(json) || _lodash2.default.isRegExp(json)) {

      throw new Error('You should only pass objects to $setJson method. ' + '$setJson method was given an invalid value ' + json);
    }

    if (!options.patch) {
      json = mergeWithDefaults(this.constructor.getJsonSchema(), json);
    }

    // If the json contains query properties like, knex Raw queries or knex/objection query
    // builders, we need to split those off into a separate object. This object will be
    // joined back in the $toDatabaseJson method.
    var split = (0, _splitQueryProps2.default)(this.constructor, json);

    if (split.query) {
      // Stash the query properties for later use in $toDatabaseJson method.
      this.$stashedQueryProps(split.query);
    }

    split.json = this.$parseJson(split.json, options);
    split.json = this.$validate(split.json, options);

    return this.$set(split.json);
  };

  /**
   * @param {Object} json
   * @returns {ModelBase}
   */


  ModelBase.prototype.$setDatabaseJson = function $setDatabaseJson(json) {
    json = this.$parseDatabaseJson(json);

    if (json) {
      var keys = (0, _keys3.default)(json);

      for (var i = 0, l = keys.length; i < l; ++i) {
        var key = keys[i];
        this[key] = json[key];
      }
    }

    return this;
  };

  /**
   * @param {Object} obj
   * @returns {ModelBase}
   */


  ModelBase.prototype.$set = function $set(obj) {
    if (obj) {
      var keys = (0, _keys3.default)(obj);

      for (var i = 0, l = keys.length; i < l; ++i) {
        var key = keys[i];
        var value = obj[key];

        if (key.charAt(0) !== '$' && typeof value !== 'function') {
          this[key] = value;
        }
      }
    }

    return this;
  };

  /**
   * @param {Array.<string>=} keys
   * @returns {Array.<string>}
   */


  ModelBase.prototype.$omitFromJson = function $omitFromJson(keys) {};

  /**
   * @param {Array.<string>=} keys
   * @returns {Array.<string>}
   */


  ModelBase.prototype.$omitFromDatabaseJson = function $omitFromDatabaseJson(keys) {};

  /**
   * @param {Object=} queryProps
   * @returns {Object}
   */


  ModelBase.prototype.$stashedQueryProps = function $stashedQueryProps(queryProps) {};

  /**
   * @param {string|Array.<string>|Object.<string, boolean>} keys
   * @returns {ModelBase}
   */


  ModelBase.prototype.$omit = function $omit() {
    if (arguments.length === 1 && _lodash2.default.isObject(arguments[0])) {
      var keys = arguments[0];

      if (Array.isArray(keys)) {
        omitArray(this, keys);
      } else {
        omitObject(this, keys);
      }
    } else {
      omitArray(this, _lodash2.default.toArray(arguments));
    }

    return this;
  };

  /**
   * @param {string|Array.<string>|Object.<string, boolean>} keys
   * @returns {ModelBase} `this` for chaining.
   */


  ModelBase.prototype.$pick = function $pick() {
    if (arguments.length === 1 && _lodash2.default.isObject(arguments[0])) {
      var keys = arguments[0];

      if (Array.isArray(keys)) {
        pickArray(this, keys);
      } else {
        pickObject(this, keys);
      }
    } else {
      pickArray(this, _lodash2.default.toArray(arguments));
    }

    return this;
  };

  /**
   * @param {Array.<string>} props
   * @return {Array.<*>}
   */


  ModelBase.prototype.$values = function $values() {
    if (arguments.length === 0) {
      return _lodash2.default.values(this);
    } else {
      var args = arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0] : arguments;

      switch (args.length) {
        case 1:
          return [this[args[0]]];
        case 2:
          return [this[args[0]], this[args[1]]];
        case 3:
          return [this[args[0]], this[args[1]], this[args[2]]];
        default:
          {
            var ret = new Array(args.length);

            for (var i = 0, l = args.length; i < l; ++i) {
              ret[i] = this[args[i]];
            }

            return ret;
          }
      }
    }
  };

  /**
   * @param {Array.<string>} props
   * @return {string}
   */


  ModelBase.prototype.$propKey = function $propKey(props) {
    switch (props.length) {
      case 1:
        return this[props[0]] + '';
      case 2:
        return this[props[0]] + ',' + this[props[1]];
      case 3:
        return this[props[0]] + ',' + this[props[1]] + ',' + this[props[2]];
      default:
        {
          var key = '';

          for (var i = 0, l = props.length; i < l; ++i) {
            key += this[props[i]] + (i < props.length - 1 ? ',' : '');
          }

          return key;
        }
    }
  };

  /**
   * @return {ModelBase}
   */


  ModelBase.prototype.$clone = function $clone() {
    var clone = new this.constructor();
    var keys = (0, _keys3.default)(this);

    for (var i = 0, l = keys.length; i < l; ++i) {
      var key = keys[i];
      var value = this[key];

      if (_lodash2.default.isObject(value)) {
        clone[key] = cloneObject(value);
      } else {
        clone[key] = value;
      }
    }

    if (this.$omitFromDatabaseJson()) {
      clone.$omitFromDatabaseJson(this.$omitFromDatabaseJson());
    }

    if (this.$omitFromJson()) {
      clone.$omitFromJson(this.$omitFromJson());
    }

    if (this.$stashedQueryProps()) {
      clone.$stashedQueryProps(this.$stashedQueryProps());
    }

    return clone;
  };

  /**
   * @protected
   */


  ModelBase.prototype.$$toJson = function $$toJson(createDbJson, omit, pick) {
    var json = toJsonImpl(this, createDbJson, omit, pick);

    if (createDbJson) {
      return this.$formatDatabaseJson(json);
    } else {
      return this.$formatJson(json);
    }
  };

  /**
   * @param {function=} subclassConstructor
   * @return {Constructor.<ModelBase>}
   */


  ModelBase.extend = function extend(subclassConstructor) {
    if (_lodash2.default.isEmpty(subclassConstructor.name)) {
      throw new Error('Each ModelBase subclass constructor must have a name');
    }

    (0, _classUtils.inherits)(subclassConstructor, this);
    return subclassConstructor;
  };

  /**
   * @param {Object=} json
   * @param {ModelOptions=} options
   * @returns {Model}
   * @throws ValidationError
   */


  ModelBase.fromJson = function fromJson(json, options) {
    var model = new this();
    model.$setJson(json || {}, options);
    return model;
  };

  /**
   * @param {Object=} json
   * @returns {Model}
   */


  ModelBase.fromDatabaseJson = function fromDatabaseJson(json) {
    var model = new this();
    model.$setDatabaseJson(json || {});
    return model;
  };

  /**
   * @param {Object} obj
   * @param {string} prop
   */


  ModelBase.omitImpl = function omitImpl(obj, prop) {
    delete obj[prop];
  };

  /**
   * @param {Object} jsonSchema
   * @param {boolean} skipRequired
   * @returns {function}
   */


  ModelBase.getJsonSchemaValidator = function getJsonSchemaValidator(jsonSchema, skipRequired) {
    skipRequired = !!skipRequired;

    if (jsonSchema === this.getJsonSchema()) {
      // Fast path for the common case: the json schema is never modified.
      return this.getDefaultJsonSchemaValidator(skipRequired);
    } else {
      var key = (0, _stringify2.default)(jsonSchema);
      var validators = ajvCache[key];

      if (!validators) {
        validators = {};
        ajvCache[key] = validators;
      }

      var validator = validators[skipRequired];
      if (!validator) {
        validator = compileJsonSchemaValidator(jsonSchema, skipRequired);
        validators[skipRequired] = validator;
      }

      return validator;
    }
  };

  ModelBase.getJsonSchema = function getJsonSchema() {
    // Memoized getter in case jsonSchema is a getter property (usually is with ES6).
    return this.jsonSchema;
  };

  /**
   * @returns {function}
   */


  ModelBase.getDefaultJsonSchemaValidator = function getDefaultJsonSchemaValidator(skipRequired) {
    return compileJsonSchemaValidator(this.getJsonSchema(), skipRequired);
  };

  /**
   * @param {string} columnName
   * @returns {string}
   */


  ModelBase.columnNameToPropertyName = function columnNameToPropertyName(columnName) {
    var model = new this();
    var addedProps = _lodash2.default.keys(model.$parseDatabaseJson({}));

    var row = {};
    row[columnName] = null;

    var props = _lodash2.default.keys(model.$parseDatabaseJson(row));
    var propertyName = _lodash2.default.first(_lodash2.default.difference(props, addedProps));

    return propertyName || null;
  };

  /**
   * @param {string} propertyName
   * @returns {string}
   */


  ModelBase.propertyNameToColumnName = function propertyNameToColumnName(propertyName) {
    var model = new this();
    var addedCols = _lodash2.default.keys(model.$formatDatabaseJson({}));

    var obj = {};
    obj[propertyName] = null;

    var cols = _lodash2.default.keys(model.$formatDatabaseJson(obj));
    var columnName = _lodash2.default.first(_lodash2.default.difference(cols, addedCols));

    return columnName || null;
  };

  return ModelBase;
}(), _class2.jsonSchema = null, _class2.virtualAttributes = null, _temp), (_applyDecoratedDescriptor(_class.prototype, '$omitFromJson', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, '$omitFromJson'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '$omitFromDatabaseJson', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, '$omitFromDatabaseJson'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '$stashedQueryProps', [_dec3], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, '$stashedQueryProps'), _class.prototype), _applyDecoratedDescriptor(_class, 'getJsonSchema', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class, 'getJsonSchema'), _class), _applyDecoratedDescriptor(_class, 'getDefaultJsonSchemaValidator', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class, 'getDefaultJsonSchemaValidator'), _class), _applyDecoratedDescriptor(_class, 'columnNameToPropertyName', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class, 'columnNameToPropertyName'), _class), _applyDecoratedDescriptor(_class, 'propertyNameToColumnName', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class, 'propertyNameToColumnName'), _class)), _class));
exports.default = ModelBase;


function mergeWithDefaults(jsonSchema, json) {
  var merged = null;

  if (!jsonSchema) {
    return json;
  }

  var propNames = (0, _keys3.default)(jsonSchema.properties);
  // Check each schema property for default value.
  for (var i = 0, l = propNames.length; i < l; ++i) {
    var propName = propNames[i];
    var prop = jsonSchema.properties[propName];

    if (!_lodash2.default.has(json, propName) && _lodash2.default.has(prop, 'default')) {
      if (merged === null) {
        // Only take expensive clone if needed.
        merged = _lodash2.default.cloneDeep(json);
      }

      if (_lodash2.default.isObject(prop.default)) {
        merged[propName] = _lodash2.default.cloneDeep(prop.default);
      } else {
        merged[propName] = prop.default;
      }
    }
  }

  if (merged === null) {
    return json;
  } else {
    return merged;
  }
}

function parseValidationError(errors) {
  var errorHash = {};
  var index = 0;

  for (var i = 0; i < errors.length; ++i) {
    var error = errors[i];
    var key = error.dataPath.substring(1);

    if (!key) {
      var match = /should have required property '(.+)'/.exec(error.message);
      if (match && match.length > 1) {
        key = match[1];
      }
    }

    if (!key && error.params && error.params.additionalProperty) {
      key = error.params.additionalProperty;
    }

    if (!key) {
      key = (index++).toString();
    }

    errorHash[key] = error.message;
  }

  return new _ValidationError2.default(errorHash);
}

function toJsonImpl(model, createDbJson, omit, pick) {
  if (createDbJson) {
    return toDatabaseJsonImpl(model, omit, pick);
  } else {
    return toExternalJsonImpl(model, omit, pick);
  }
}

function toDatabaseJsonImpl(model, omit, pick) {
  var json = {};
  var omitFromJson = model.$omitFromDatabaseJson();
  var stash = model.$stashedQueryProps();

  if (stash) {
    var _keys = (0, _keys3.default)(stash);

    for (var i = 0, l = _keys.length; i < l; ++i) {
      var key = _keys[i];
      json[key] = stash[key];
    }
  }

  var keys = (0, _keys3.default)(model);

  for (var _i = 0, _l = keys.length; _i < _l; ++_i) {
    var _key = keys[_i];
    assignJsonValue(json, _key, model[_key], omit, pick, omitFromJson, true);
  }

  return json;
}

function toExternalJsonImpl(model, omit, pick) {
  var json = {};
  var omitFromJson = model.$omitFromJson();
  var keys = (0, _keys3.default)(model);

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];
    assignJsonValue(json, key, model[key], omit, pick, omitFromJson, false);
  }

  if (model.constructor.virtualAttributes) {
    var vAttr = model.constructor.virtualAttributes;

    for (var _i2 = 0, _l2 = vAttr.length; _i2 < _l2; ++_i2) {
      var _key2 = vAttr[_i2];
      var value = model[_key2];

      if (_lodash2.default.isFunction(value)) {
        value = value.call(model);
      }

      assignJsonValue(json, _key2, value, omit, pick, omitFromJson, false);
    }
  }

  return json;
}

function assignJsonValue(json, key, value, omit, pick, omitFromJson, createDbJson) {
  if (key.charAt(0) !== '$' && !_lodash2.default.isFunction(value) && !_lodash2.default.isUndefined(value) && (!omit || !omit[key]) && (!pick || pick[key]) && (!omitFromJson || !contains(omitFromJson, key))) {

    if (value !== null && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
      json[key] = toJsonObject(value, createDbJson);
    } else {
      json[key] = value;
    }
  }
}

function toJsonObject(value, createDbJson) {
  if (Array.isArray(value)) {
    return toJsonArray(value, createDbJson);
  } else if (value instanceof ModelBase) {
    if (createDbJson) {
      return value.$toDatabaseJson();
    } else {
      return value.$toJson();
    }
  } else if (Buffer.isBuffer(value)) {
    return value;
  } else {
    return _lodash2.default.cloneDeep(value);
  }
}

function toJsonArray(value, createDbJson) {
  var ret = new Array(value.length);

  for (var i = 0, l = ret.length; i < l; ++i) {
    ret[i] = toJsonObject(value[i], createDbJson);
  }

  return ret;
}

function cloneObject(value) {
  if (Array.isArray(value)) {
    return cloneArray(value);
  } else if (value instanceof ModelBase) {
    return value.$clone();
  } else if (Buffer.isBuffer(value)) {
    return new Buffer(value);
  } else {
    return _lodash2.default.cloneDeep(value);
  }
}

function cloneArray(value) {
  var ret = new Array(value.length);

  for (var i = 0, l = ret.length; i < l; ++i) {
    ret[i] = cloneObject(value[i]);
  }

  return ret;
}

function omitObject(model, keyObj) {
  var ModelClass = model.constructor;
  var keys = (0, _keys3.default)(keyObj);

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];
    var value = keyObj[key];

    if (value && key.charAt(0) !== '$' && _lodash2.default.has(model, key)) {
      ModelClass.omitImpl(model, key);
    }
  }
}

function omitArray(model, keys) {
  var ModelClass = model.constructor;

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];

    if (key.charAt(0) !== '$' && _lodash2.default.has(model, key)) {
      ModelClass.omitImpl(model, key);
    }
  }
}

function pickObject(model, keyObj) {
  var ModelClass = model.constructor;
  var keys = (0, _keys3.default)(model);

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];

    if (key.charAt(0) !== '$' && !keyObj[key]) {
      ModelClass.omitImpl(model, key);
    }
  }
}

function pickArray(model, pick) {
  var ModelClass = model.constructor;
  var keys = (0, _keys3.default)(model);

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];

    if (key.charAt(0) !== '$' && !contains(pick, key)) {
      ModelClass.omitImpl(model, key);
    }
  }
}

function contains(arr, value) {
  for (var i = 0, l = arr.length; i < l; ++i) {
    if (arr[i] === value) {
      return true;
    }
  }
  return false;
}

function compileJsonSchemaValidator(jsonSchema, skipRequired) {
  var origRequired = void 0;

  try {
    if (skipRequired) {
      origRequired = jsonSchema.required;
      jsonSchema.required = [];
    }

    return ajv.compile(jsonSchema);
  } finally {
    if (skipRequired) {
      jsonSchema.required = origRequired;
    }
  }
}