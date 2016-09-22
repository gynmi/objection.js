"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QueryBuilderContextBase = function () {
  function QueryBuilderContextBase() {
    (0, _classCallCheck3.default)(this, QueryBuilderContextBase);

    this.userContext = {};
    this.skipUndefined = false;
    this.knex = null;
  }

  QueryBuilderContextBase.prototype.clone = function clone() {
    var ctx = new this.constructor();

    ctx.userContext = this.userContext;
    ctx.skipUndefined = this.skipUndefined;
    ctx.knex = this.knex;

    return ctx;
  };

  return QueryBuilderContextBase;
}();

exports.default = QueryBuilderContextBase;