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

var _WrappingQueryBuilderOperation = require('./WrappingQueryBuilderOperation');

var _WrappingQueryBuilderOperation2 = _interopRequireDefault(_WrappingQueryBuilderOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WhereCompositeOperation = function (_WrappingQueryBuilder) {
  (0, _inherits3.default)(WhereCompositeOperation, _WrappingQueryBuilder);

  function WhereCompositeOperation() {
    (0, _classCallCheck3.default)(this, WhereCompositeOperation);
    return (0, _possibleConstructorReturn3.default)(this, _WrappingQueryBuilder.apply(this, arguments));
  }

  WhereCompositeOperation.prototype.onBuild = function onBuild(knexBuilder) {
    if (this.args.length === 2) {
      this.build(knexBuilder, this.args[0], '=', this.args[1]);
    } else if (this.args.length === 3) {
      this.build(knexBuilder, this.args[0], this.args[1], this.args[2]);
    } else {
      throw new Error('invalid number of arguments ' + this.args.length);
    }
  };

  WhereCompositeOperation.prototype.build = function build(knexBuilder, cols, op, values) {
    var colsIsArray = Array.isArray(cols);
    var valuesIsArray = Array.isArray(values);

    if (!colsIsArray && !valuesIsArray) {
      knexBuilder.where(cols, op, values);
    } else if (colsIsArray && cols.length === 1 && !valuesIsArray) {
      knexBuilder.where(cols[0], op, values);
    } else if (colsIsArray && valuesIsArray && cols.length === values.length) {
      for (var i = 0, l = cols.length; i < l; ++i) {
        knexBuilder.where(cols[i], op, values[i]);
      }
    } else {
      throw new Error('both cols and values must have same dimensions');
    }
  };

  return WhereCompositeOperation;
}(_WrappingQueryBuilderOperation2.default);

exports.default = WhereCompositeOperation;