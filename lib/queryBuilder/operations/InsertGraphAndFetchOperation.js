'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _DelegateOperation2 = require('./DelegateOperation');

var _DelegateOperation3 = _interopRequireDefault(_DelegateOperation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InsertGraphAndFetchOperation = function (_DelegateOperation) {
  (0, _inherits3.default)(InsertGraphAndFetchOperation, _DelegateOperation);

  function InsertGraphAndFetchOperation() {
    (0, _classCallCheck3.default)(this, InsertGraphAndFetchOperation);
    return (0, _possibleConstructorReturn3.default)(this, _DelegateOperation.apply(this, arguments));
  }

  InsertGraphAndFetchOperation.prototype.onAfterInternal = function onAfterInternal(builder) {
    var _this2 = this;

    var eagerTree = buildEagerTree(this.models, (0, _create2.default)(null));
    var eager = buildEager(eagerTree);
    var modelClass = this.models[0].constructor;
    var ids = new Array(this.models.length);

    for (var i = 0, l = this.models.length; i < l; ++i) {
      ids[i] = this.models[i].$id();
    }

    return modelClass.query().childQueryOf(builder).whereIn(modelClass.getFullIdColumn(), ids).eager(eager).then(function (models) {
      return _this2.isArray ? models : models[0] || null;
    });
  };

  (0, _createClass3.default)(InsertGraphAndFetchOperation, [{
    key: 'models',
    get: function get() {
      return this.delegate.models;
    }
  }, {
    key: 'isArray',
    get: function get() {
      return this.delegate.isArray;
    }
  }]);
  return InsertGraphAndFetchOperation;
}(_DelegateOperation3.default);

exports.default = InsertGraphAndFetchOperation;


function buildEagerTree(models, tree) {
  if (!models) {
    return;
  }

  if (Array.isArray(models)) {
    for (var i = 0, l = models.length; i < l; ++i) {
      buildEagerTreeForModel(models[i], tree);
    }
  } else {
    buildEagerTreeForModel(models, tree);
  }

  return tree;
}

function buildEagerTreeForModel(model, tree) {
  var modelClass = model.constructor;
  var relations = modelClass.getRelations();
  var relNames = (0, _keys2.default)(relations);

  for (var r = 0, lr = relNames.length; r < lr; ++r) {
    var relName = relNames[r];

    if (model.hasOwnProperty(relName)) {
      var subTree = tree[relName];

      if (!subTree) {
        subTree = (0, _create2.default)(null);
        tree[relName] = subTree;
      }

      buildEagerTree(model[relName], subTree);
    }
  }
}

function buildEager(eagerTree) {
  var keys = (0, _keys2.default)(eagerTree);
  var eager = '';

  for (var i = 0, l = keys.length; i < l; ++i) {
    var key = keys[i];

    eager += key;

    var subEager = buildEager(eagerTree[key]);

    if (subEager) {
      eager += '.' + subEager;
    }

    if (i < keys.length - 1) {
      eager += ', ';
    }
  }

  if (keys.length > 1) {
    eager = '[' + eager + ']';
  }

  return eager;
}