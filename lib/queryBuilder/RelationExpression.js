'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _relationExpressionParser = require('./parsers/relationExpressionParser');

var _relationExpressionParser2 = _interopRequireDefault(_relationExpressionParser);

var _ValidationError = require('./../ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RECURSIVE_REGEX = /^\^(\d*)$/;
var ALL_RECURSIVE_REGEX = /^\*$/;

var RelationExpression = function () {
  function RelationExpression(node, recursionDepth, filters) {
    (0, _classCallCheck3.default)(this, RelationExpression);

    node = node || {};

    this.name = node.name || null;
    this.args = node.args || [];
    this.numChildren = node.numChildren || 0;
    this.children = node.children || {};

    Object.defineProperty(this, '_recursionDepth', {
      enumerable: false,
      value: recursionDepth || 0
    });

    Object.defineProperty(this, '_filters', {
      enumerable: false,
      writable: true,
      value: filters || {}
    });
  }

  /**
   * @param {string|RelationExpression} expr
   * @returns {RelationExpression}
   */


  RelationExpression.parse = function parse(expr) {
    if (expr instanceof RelationExpression) {
      return expr;
    } else if (!_lodash2.default.isString(expr) || _lodash2.default.isEmpty(expr.trim())) {
      return new RelationExpression();
    } else {
      try {
        return new RelationExpression(_relationExpressionParser2.default.parse(expr));
      } catch (err) {
        throw new _ValidationError2.default({
          message: 'Invalid relation expression "' + expr + '"',
          cause: err.message
        });
      }
    }
  };

  /**
   * @param {string|RelationExpression} expr
   * @returns {boolean}
   */
  RelationExpression.prototype.isSubExpression = function isSubExpression(expr) {
    var _this = this;

    expr = RelationExpression.parse(expr);

    if (this.isAllRecursive()) {
      return true;
    }

    if (expr.isAllRecursive()) {
      return this.isAllRecursive();
    }

    if (this.name !== expr.name) {
      return false;
    }

    var maxRecursionDepth = expr.maxRecursionDepth();

    if (maxRecursionDepth > 0) {
      return this.isAllRecursive() || this.maxRecursionDepth() >= maxRecursionDepth;
    }

    return _lodash2.default.every(expr.children, function (child, childName) {
      var ownSubExpression = _this.childExpression(childName);
      var subExpression = expr.childExpression(childName);

      return ownSubExpression && ownSubExpression.isSubExpression(subExpression);
    });
  };

  /**
   * @returns {number}
   */


  RelationExpression.prototype.maxRecursionDepth = function maxRecursionDepth() {
    if (this.numChildren !== 1) {
      return 0;
    }

    var key = (0, _keys2.default)(this.children)[0];
    var rec = RECURSIVE_REGEX.exec(key);

    if (rec) {
      var maxDepth = rec[1];

      if (maxDepth) {
        return parseInt(maxDepth, 10);
      } else {
        return Number.POSITIVE_INFINITY;
      }
    } else {
      return 0;
    }
  };

  /**
   * @returns {boolean}
   */


  RelationExpression.prototype.isAllRecursive = function isAllRecursive() {
    if (this.numChildren !== 1) {
      return false;
    }

    var key = (0, _keys2.default)(this.children)[0];
    return ALL_RECURSIVE_REGEX.test(key);
  };

  /**
   * @returns {RelationExpression}
   */


  RelationExpression.prototype.childExpression = function childExpression(childName) {
    if (this.isAllRecursive() || childName === this.name && this._recursionDepth < this.maxRecursionDepth() - 1) {
      return new RelationExpression(this, this._recursionDepth + 1, this._filters);
    }

    if (this.children[childName]) {
      return new RelationExpression(this.children[childName], 0, this._filters);
    } else {
      return null;
    }
  };

  /**
   * @returns {RelationExpression}
   */


  RelationExpression.prototype.clone = function clone() {
    return new RelationExpression(JSON.parse((0, _stringify2.default)(this)), this._recursionDepth, _lodash2.default.clone(this._filters));
  };

  RelationExpression.prototype.forEachChild = function forEachChild(cb) {
    _lodash2.default.forOwn(this.children, function (child, childName) {
      if (!ALL_RECURSIVE_REGEX.test(childName) && !RECURSIVE_REGEX.test(childName)) {
        cb(child, childName);
      }
    });
  };

  /**
   * @param {string|RelationExpression} path
   * @param {function(QueryBuilder)} filter
   */


  RelationExpression.prototype.addAnonymousFilterAtPath = function addAnonymousFilterAtPath(path, filter) {
    var filterNodes = this._nodesAtPath(path);
    var filters = this.filters;

    var idx = 0;
    var filterName = '_efe0_';

    while (filters[filterName]) {
      filterName = '_efe' + ++idx + '_';
    }

    if (!_lodash2.default.isEmpty(filterNodes)) {
      filters[filterName] = filter;
      _lodash2.default.each(filterNodes, function (node) {
        return node.args.push(filterName);
      });
    }
  };

  /**
   * @returns {string}
   */


  RelationExpression.prototype.toString = function toString() {
    return _toString(this);
  };

  /**
   * @private
   * @return {Array.<Object>}
   */


  RelationExpression.prototype._nodesAtPath = function _nodesAtPath(pathExpression) {
    var path = RelationExpression.parse(pathExpression);
    var nodes = [];

    RelationExpression.nodesAtPath(this, path, nodes);
    return nodes;
  };

  /**
   * @private
   */


  RelationExpression.nodesAtPath = function nodesAtPath(target, path, expressions) {
    var _this2 = this;

    if (path.numChildren == 0) {
      expressions.push(target);
    } else {
      _lodash2.default.forOwn(path.children, function (child) {
        var targetChild = target.children[child.name];

        if (targetChild) {
          _this2.nodesAtPath(targetChild, child, expressions);
        }
      });
    }
  };

  (0, _createClass3.default)(RelationExpression, [{
    key: 'filters',
    get: function get() {
      return this._filters;
    },
    set: function set(filters) {
      this._filters = filters || {};
    }
  }]);
  return RelationExpression;
}();

exports.default = RelationExpression;


function _toString(node) {
  var childExpr = _lodash2.default.values(node.children).map(_toString);

  if (childExpr.length > 1) {
    childExpr = '[' + childExpr.join(', ') + ']';
  } else {
    childExpr = childExpr[0];
  }

  var str = node.name;

  if (node.args.length) {
    str += '(' + node.args.join(', ') + ')';
  }

  if (childExpr) {
    if (str) {
      return str + '.' + childExpr;
    } else {
      return childExpr;
    }
  } else {
    return str;
  }
}