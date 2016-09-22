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

var _Dependency2 = require('./Dependency');

var _Dependency3 = _interopRequireDefault(_Dependency2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReplaceValueDependency = function (_Dependency) {
  (0, _inherits3.default)(ReplaceValueDependency, _Dependency);

  function ReplaceValueDependency(node, path, refProp, inverse) {
    (0, _classCallCheck3.default)(this, ReplaceValueDependency);

    /**
     * @type {Array.<string>}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, _Dependency.call(this, node));

    _this.path = path.slice();

    /**
     * @type {string}
     */
    _this.refProp = refProp;

    /**
     * @type boolean
     */
    _this.inverse = inverse;
    return _this;
  }

  ReplaceValueDependency.prototype.resolve = function resolve(model) {
    if (!this.inverse) {
      _lodash2.default.set(model, this.path, this.node.model[this.refProp]);
    } else {
      _lodash2.default.set(this.node.model, this.path, model[this.refProp]);
    }
  };

  return ReplaceValueDependency;
}(_Dependency3.default);

exports.default = ReplaceValueDependency;