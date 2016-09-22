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

var InterpolateValueDependency = function (_Dependency) {
  (0, _inherits3.default)(InterpolateValueDependency, _Dependency);

  function InterpolateValueDependency(node, path, refProp, match, inverse) {
    (0, _classCallCheck3.default)(this, InterpolateValueDependency);

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
     * @type {string}
     */
    _this.match = match;

    /**
     * @type boolean
     */
    _this.inverse = inverse;
    return _this;
  }

  InterpolateValueDependency.prototype.resolve = function resolve(model) {
    if (!this.inverse) {
      var value = _lodash2.default.get(model, this.path);
      value = value.replace(this.match, this.node.model[this.refProp]);
      _lodash2.default.set(model, this.path, value);
    } else {
      var _value = _lodash2.default.get(this.node.model, this.path);
      _value = _value.replace(this.match, model[this.refProp]);
      _lodash2.default.set(this.node.model, this.path, _value);
    }
  };

  return InterpolateValueDependency;
}(_Dependency3.default);

exports.default = InterpolateValueDependency;