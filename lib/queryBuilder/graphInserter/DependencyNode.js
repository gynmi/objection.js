"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DependencyNode = function DependencyNode(model, modelClass) {
  (0, _classCallCheck3.default)(this, DependencyNode);

  this.id = model[model.constructor.uidProp];

  /**
   * @type {Model}
   */
  this.model = model;

  /**
   * @type {Constructor.<Model>}
   */
  this.modelClass = modelClass;

  /**
   * @type {Array.<Dependency>}
   */
  this.needs = [];

  /**
   * @type {Array.<Dependency>}
   */
  this.isNeededBy = [];

  /**
   * @type {Array.<ManyToManyConnection>}
   */
  this.manyToManyConnections = [];

  this.numHandledNeeds = 0;
  this.handled = false;
  this.visited = false;
  this.recursion = false;
};

exports.default = DependencyNode;