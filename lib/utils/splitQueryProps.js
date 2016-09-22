'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = function (ModelClass, obj) {
  if (QueryBuilderBase === null) {
    // Lazy loading to prevent circular deps.
    QueryBuilderBase = require('../queryBuilder/QueryBuilderBase').default;
  }

  var keys = (0, _keys2.default)(obj);
  var needsSplit = false;

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];
    var value = obj[key];

    if (value instanceof KnexQueryBuilder || value instanceof QueryBuilderBase || value instanceof KnexRaw) {
      needsSplit = true;
      break;
    }
  }

  if (needsSplit) {
    return split(obj);
  } else {
    return { json: obj, query: null };
  }
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KnexQueryBuilder = require('knex/lib/query/builder');
var KnexRaw = require('knex/lib/raw');
var QueryBuilderBase = null;

function split(obj) {
  var ret = { json: {}, query: {} };
  var keys = (0, _keys2.default)(obj);

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];
    var value = obj[key];

    if (value instanceof KnexQueryBuilder || value instanceof KnexRaw) {
      ret.query[key] = value;
    } else if (value instanceof QueryBuilderBase) {
      ret.query[key] = value.build();
    } else {
      ret.json[key] = value;
    }
  }

  return ret;
}