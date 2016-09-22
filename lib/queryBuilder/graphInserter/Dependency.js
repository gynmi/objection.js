'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dependency = function () {
  function Dependency(node) {
    (0, _classCallCheck3.default)(this, Dependency);

    /**
     * @type {DependencyNode}
     */
    this.node = node;
  }

  Dependency.prototype.resolve = function resolve(model) {
    throw new Error('not implemented');
  };

  return Dependency;
}();

exports.default = Dependency;