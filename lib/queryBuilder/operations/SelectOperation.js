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

var SelectOperation = function (_WrappingQueryBuilder) {
  (0, _inherits3.default)(SelectOperation, _WrappingQueryBuilder);

  function SelectOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, SelectOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _WrappingQueryBuilder.call(this, knex, name, opt));

    _this.selections = [];
    return _this;
  }

  SelectOperation.parseSelection = function parseSelection(selection) {
    if (!_lodash2.default.isString(selection)) {
      return null;
    }

    // Discard the possible alias.
    selection = selection.split(/\s+as\s+}/i)[0].trim();
    var dotIdx = selection.indexOf('.');

    if (dotIdx !== -1) {
      return {
        table: selection.substr(0, dotIdx),
        column: selection.substr(dotIdx + 1)
      };
    } else {
      return {
        table: null,
        column: selection
      };
    }
  };

  SelectOperation.prototype.call = function call(builder, args) {
    var ret = _WrappingQueryBuilder.prototype.call.call(this, builder, args);
    var selections = _lodash2.default.flatten(this.args);

    for (var i = 0, l = selections.length; i < l; ++i) {
      var selection = SelectOperation.parseSelection(selections[i]);

      if (selection) {
        this.selections.push(selection);
      }
    }

    return ret;
  };

  SelectOperation.prototype.onBuild = function onBuild(builder) {
    builder.select.apply(builder, this.args);
  };

  SelectOperation.prototype.hasSelection = function hasSelection(fromTable, selection) {
    var select1 = SelectOperation.parseSelection(selection);

    if (!select1) {
      return false;
    }

    for (var i = 0, l = this.selections.length; i < l; ++i) {
      var select2 = this.selections[i];

      var match = select1.table === select2.table && select1.column === select2.column || select1.table === select2.table && select2.column === '*' || select1.table === null && select2.table === fromTable && select1.column === select2.column || select2.table === null && select1.table === fromTable && select1.column === select2.column;

      if (match) {
        return true;
      }
    }

    return false;
  };

  return SelectOperation;
}(_WrappingQueryBuilderOperation2.default);

exports.default = SelectOperation;