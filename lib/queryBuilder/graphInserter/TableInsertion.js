"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TableInsertion = function TableInsertion(modelClass, isJoinTableInsertion) {
  (0, _classCallCheck3.default)(this, TableInsertion);

  /**
   * @type {Constructor.<Model>}
   */
  this.modelClass = modelClass;

  /**
   * @type {boolean}
   */
  this.isJoinTableInsertion = isJoinTableInsertion;

  /**
   * @type {Array.<Model>}
   */
  this.models = [];

  /**
   * @type {Array.<Boolean>}
   */
  this.isInputModel = [];
};

exports.default = TableInsertion;