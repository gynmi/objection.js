'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _WrappingQueryBuilderOperation = require('./WrappingQueryBuilderOperation');

var _WrappingQueryBuilderOperation2 = _interopRequireDefault(_WrappingQueryBuilderOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WhereInCompositeOperation = function (_WrappingQueryBuilder) {
  (0, _inherits3.default)(WhereInCompositeOperation, _WrappingQueryBuilder);

  function WhereInCompositeOperation() {
    (0, _classCallCheck3.default)(this, WhereInCompositeOperation);
    return (0, _possibleConstructorReturn3.default)(this, _WrappingQueryBuilder.apply(this, arguments));
  }

  WhereInCompositeOperation.prototype.onBuild = function onBuild(knexBuilder) {
    this.build(knexBuilder, this.args[0], this.args[1]);
  };

  WhereInCompositeOperation.prototype.build = function build(knexBuilder, columns, values) {
    var isCompositeKey = Array.isArray(columns) && columns.length > 1;

    if (isCompositeKey) {
      this.buildComposite(knexBuilder, columns, values);
    } else {
      this.buildNonComposite(knexBuilder, columns, values);
    }
  };

  WhereInCompositeOperation.prototype.buildComposite = function buildComposite(knexBuilder, columns, values) {
    if (Array.isArray(values)) {
      this.buildCompositeValue(knexBuilder, columns, values);
    } else {
      this.buildCompositeSubquery(knexBuilder, columns, values);
    }
  };

  WhereInCompositeOperation.prototype.buildCompositeValue = function buildCompositeValue(knexBuilder, columns, values) {
    knexBuilder.whereIn(columns, values);
  };

  WhereInCompositeOperation.prototype.buildCompositeSubquery = function buildCompositeSubquery(knexBuilder, columns, subquery) {
    var formatter = this.formatter();

    var sql = '(';
    for (var i = 0, l = columns.length; i < l; ++i) {
      sql += formatter.wrap(columns[i]);

      if (i !== columns.length - 1) {
        sql += ',';
      }
    }
    sql += ')';

    knexBuilder.whereIn(this.raw(sql), subquery);
  };

  WhereInCompositeOperation.prototype.buildNonComposite = function buildNonComposite(knexBuilder, columns, values) {
    var col = typeof columns === 'string' ? columns : columns[0];

    if (Array.isArray(values)) {
      values = _lodash2.default.compact(_lodash2.default.flatten(values));
    } else {
      values = [values];
    }

    knexBuilder.whereIn(col, values);
  };

  return WhereInCompositeOperation;
}(_WrappingQueryBuilderOperation2.default);

exports.default = WhereInCompositeOperation;