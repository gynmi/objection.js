"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ManyToManyConnection = function ManyToManyConnection(node, relation) {
  (0, _classCallCheck3.default)(this, ManyToManyConnection);

  /**
   * @type {DependencyNode}
   */
  this.node = node;

  /**
   * @type {DependencyNode}
   */
  this.refNode = null;

  /**
   * @type {Relation}
   */
  this.relation = relation;

  relation.omitExtraProps([node.model]);
};

exports.default = ManyToManyConnection;