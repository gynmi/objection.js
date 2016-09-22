"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QueryBuilderOperation = function () {

  /**
   * @param {knex} knex
   * @param {string} name
   * @param {Object} opt
   */
  function QueryBuilderOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, QueryBuilderOperation);

    this.name = name;
    this.opt = opt || {};
    this.knex = knex;
    this.isWriteOperation = false;
  }

  /**
   * @returns {knex.Formatter}
   */


  QueryBuilderOperation.prototype.formatter = function formatter() {
    return this.knex.client.formatter();
  };

  /**
   * @returns {knex.Raw}
   */


  QueryBuilderOperation.prototype.raw = function raw() {
    return this.knex.raw.apply(this.knex, arguments);
  };

  /**
   * @param {QueryBuilder} builder
   * @param {Array.<*>} args
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.call = function call(builder, args) {
    return true;
  };

  /**
   * @param {QueryBuilder} builder
   * @param {*} result
   * @returns {Promise|*}
   */


  QueryBuilderOperation.prototype.onBefore = function onBefore(builder, result) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnBefore = function hasOnBefore() {
    return this.onBefore !== QueryBuilderOperation.prototype.onBefore;
  };

  /**
   * @param {QueryBuilder} builder
   * @param {*} result
   * @returns {Promise|*}
   */


  QueryBuilderOperation.prototype.onBeforeInternal = function onBeforeInternal(builder, result) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnBeforeInternal = function hasOnBeforeInternal() {
    return this.onBeforeInternal !== QueryBuilderOperation.prototype.onBeforeInternal;
  };

  /**
   * @param {QueryBuilder} builder
   */


  QueryBuilderOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnBeforeBuild = function hasOnBeforeBuild() {
    return this.onBeforeBuild !== QueryBuilderOperation.prototype.onBeforeBuild;
  };

  /**
   * @param {QueryBuilder} knexBuilder
   * @param {QueryBuilder} builder
   */


  QueryBuilderOperation.prototype.onBuild = function onBuild(knexBuilder, builder) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnBuild = function hasOnBuild() {
    return this.onBuild !== QueryBuilderOperation.prototype.onBuild;
  };

  /**
   * @param {QueryBuilder} builder
   * @param {*} result
   * @returns {*}
   */


  QueryBuilderOperation.prototype.onRawResult = function onRawResult(builder, result) {
    return rows;
  };

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnRawResult = function hasOnRawResult() {
    return this.onRawResult !== QueryBuilderOperation.prototype.onRawResult;
  };

  /**
   * @param {QueryBuilder} builder
   * @param {*} result
   * @returns {Promise|*}
   */


  QueryBuilderOperation.prototype.onAfterQuery = function onAfterQuery(builder, result) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnAfterQuery = function hasOnAfterQuery() {
    return this.onAfterQuery !== QueryBuilderOperation.prototype.onAfterQuery;
  };

  /**
   * @param {QueryBuilder} builder
   * @param {*} result
   * @returns {Promise|*}
   */


  QueryBuilderOperation.prototype.onAfterInternal = function onAfterInternal(builder, result) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnAfterInternal = function hasOnAfterInternal() {
    return this.onAfterInternal !== QueryBuilderOperation.prototype.onAfterInternal;
  };

  /**
   * @param {QueryBuilder} builder
   * @param {*} result
   * @returns {Promise|*}
   */


  QueryBuilderOperation.prototype.onAfter = function onAfter(builder, result) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasOnAfter = function hasOnAfter() {
    return this.onAfter !== QueryBuilderOperation.prototype.onAfter;
  };

  /**
   * @param {QueryBuilder} builder
   * @returns {QueryBuilder}
   */


  QueryBuilderOperation.prototype.queryExecutor = function queryExecutor(builder) {};

  /**
   * @returns {boolean}
   */


  QueryBuilderOperation.prototype.hasQueryExecutor = function hasQueryExecutor() {
    return this.queryExecutor !== QueryBuilderOperation.prototype.queryExecutor;
  };

  return QueryBuilderOperation;
}();

exports.default = QueryBuilderOperation;