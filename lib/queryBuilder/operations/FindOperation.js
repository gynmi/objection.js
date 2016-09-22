'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _clone2 = require('lodash/clone');

var _clone3 = _interopRequireDefault(_clone2);

var _Model = require('../../model/Model');

var _Model2 = _interopRequireDefault(_Model);

var _QueryBuilderOperation = require('./QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

var _promiseUtils = require('../../utils/promiseUtils');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FindOperation = function (_QueryBuilderOperatio) {
  (0, _inherits3.default)(FindOperation, _QueryBuilderOperatio);

  function FindOperation() {
    (0, _classCallCheck3.default)(this, FindOperation);
    return (0, _possibleConstructorReturn3.default)(this, _QueryBuilderOperatio.apply(this, arguments));
  }

  FindOperation.prototype.clone = function clone(props) {
    props = props || {};
    return new this.constructor(this.knex, this.name, props.opt || (0, _clone3.default)(this.opt));x;
  };

  FindOperation.prototype.onAfter = function onAfter(builder, results) {
    if (this.opt.dontCallAfterGet) {
      return results;
    } else {
      return callAfterGet(builder.context(), results, !!this.opt.callAfterGetDeeply);
    }
  };

  return FindOperation;
}(_QueryBuilderOperation2.default);

exports.default = FindOperation;


function callAfterGet(ctx, results, deep) {
  if (Array.isArray(results)) {
    if (results.length === 1) {
      return callAfterGetForOne(ctx, results[0], results, deep);
    } else {
      return callAfterGetArray(ctx, results, deep);
    }
  } else {
    return callAfterGetForOne(ctx, results, results, deep);
  }
}

function callAfterGetArray(ctx, results, deep) {
  if (results.length === 0 || (0, _typeof3.default)(results[0]) !== 'object') {
    return results;
  }

  var mapped = new Array(results.length);
  var containsPromise = false;

  for (var i = 0, l = results.length; i < l; ++i) {
    mapped[i] = callAfterGetForOne(ctx, results[i], results[i], deep);

    if ((0, _promiseUtils.isPromise)(mapped[i])) {
      containsPromise = true;
    }
  }

  if (containsPromise) {
    return _bluebird2.default.all(mapped);
  } else {
    return mapped;
  }
}

function callAfterGetForOne(ctx, model, result, deep) {
  if (!(model instanceof _Model2.default)) {
    return result;
  }

  if (deep) {
    var results = [];
    var containsPromise = callAfterGetForRelations(ctx, model, results);

    if (containsPromise) {
      return _bluebird2.default.all(results).then(function () {
        return doCallAfterGet(ctx, model, result);
      });
    } else {
      return doCallAfterGet(ctx, model, result);
    }
  } else {
    return doCallAfterGet(ctx, model, result);
  }
}

function callAfterGetForRelations(ctx, model, results) {
  var relations = model.constructor.getRelations();
  var relNames = (0, _keys2.default)(relations);

  var containsPromise = false;

  for (var i = 0, l = relNames.length; i < l; ++i) {
    var relName = relNames[i];

    if (model[relName]) {
      var maybePromise = callAfterGet(ctx, model[relName], true);

      if ((0, _promiseUtils.isPromise)(maybePromise)) {
        containsPromise = true;
      }

      results.push(maybePromise);
    }
  }

  return containsPromise;
}

function doCallAfterGet(ctx, model, result) {
  if (model.$afterGet !== _Model2.default.prototype.$afterGet) {
    var maybePromise = model.$afterGet(ctx);

    if (maybePromise instanceof _bluebird2.default) {
      return maybePromise.return(result);
    } else if ((0, _promiseUtils.isPromise)(maybePromise)) {
      return maybePromise.then(function () {
        return result;
      });
    } else {
      return result;
    }
  } else {
    return result;
  }
}