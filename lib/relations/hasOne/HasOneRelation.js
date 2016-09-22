'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _HasManyRelation2 = require('../hasMany/HasManyRelation');

var _HasManyRelation3 = _interopRequireDefault(_HasManyRelation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HasOneRelation = function (_HasManyRelation) {
  (0, _inherits3.default)(HasOneRelation, _HasManyRelation);

  function HasOneRelation() {
    (0, _classCallCheck3.default)(this, HasOneRelation);
    return (0, _possibleConstructorReturn3.default)(this, _HasManyRelation.apply(this, arguments));
  }

  HasOneRelation.prototype.isOneToOne = function isOneToOne() {
    return true;
  };

  HasOneRelation.prototype.createRelationProp = function createRelationProp(owners, related) {
    var relatedByOwnerId = (0, _create2.default)(null);

    for (var i = 0, l = related.length; i < l; ++i) {
      var rel = related[i];
      var key = rel.$propKey(this.relatedProp);

      relatedByOwnerId[key] = rel;
    }

    for (var _i = 0, _l = owners.length; _i < _l; ++_i) {
      var own = owners[_i];
      var _key = own.$propKey(this.ownerProp);

      own[this.name] = relatedByOwnerId[_key] || null;
    }
  };

  HasOneRelation.prototype.appendRelationProp = function appendRelationProp(owner, related) {
    owner[this.name] = related[0] || null;
  };

  return HasOneRelation;
}(_HasManyRelation3.default);

exports.default = HasOneRelation;