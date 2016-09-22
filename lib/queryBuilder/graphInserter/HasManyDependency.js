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

var _Dependency2 = require('./Dependency');

var _Dependency3 = _interopRequireDefault(_Dependency2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HasManyDependency = function (_Dependency) {
  (0, _inherits3.default)(HasManyDependency, _Dependency);

  function HasManyDependency(node, relation) {
    (0, _classCallCheck3.default)(this, HasManyDependency);

    /**
     * @type {Relation}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, _Dependency.call(this, node));

    _this.relation = relation;
    return _this;
  }

  HasManyDependency.prototype.resolve = function resolve(model) {
    for (var i = 0; i < this.relation.relatedProp.length; ++i) {
      this.node.model[this.relation.relatedProp[i]] = model[this.relation.ownerProp[i]];
    }
  };

  return HasManyDependency;
}(_Dependency3.default);

exports.default = HasManyDependency;