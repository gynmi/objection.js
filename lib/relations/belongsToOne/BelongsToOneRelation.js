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

var _Relation2 = require('../Relation');

var _Relation3 = _interopRequireDefault(_Relation2);

var _BelongsToOneInsertOperation = require('./BelongsToOneInsertOperation');

var _BelongsToOneInsertOperation2 = _interopRequireDefault(_BelongsToOneInsertOperation);

var _BelongsToOneRelateOperation = require('./BelongsToOneRelateOperation');

var _BelongsToOneRelateOperation2 = _interopRequireDefault(_BelongsToOneRelateOperation);

var _BelongsToOneUnrelateOperation = require('./BelongsToOneUnrelateOperation');

var _BelongsToOneUnrelateOperation2 = _interopRequireDefault(_BelongsToOneUnrelateOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BelongsToOneRelation = function (_Relation) {
  (0, _inherits3.default)(BelongsToOneRelation, _Relation);

  function BelongsToOneRelation() {
    (0, _classCallCheck3.default)(this, BelongsToOneRelation);
    return (0, _possibleConstructorReturn3.default)(this, _Relation.apply(this, arguments));
  }

  BelongsToOneRelation.prototype.isOneToOne = function isOneToOne() {
    return true;
  };

  BelongsToOneRelation.prototype.createRelationProp = function createRelationProp(owners, related) {
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

  BelongsToOneRelation.prototype.insert = function insert(builder, owner) {
    return new _BelongsToOneInsertOperation2.default(builder.knex(), 'insert', {
      relation: this,
      owner: owner
    });
  };

  BelongsToOneRelation.prototype.relate = function relate(builder, owner) {
    return new _BelongsToOneRelateOperation2.default(builder.knex(), 'relate', {
      relation: this,
      owner: owner
    });
  };

  BelongsToOneRelation.prototype.unrelate = function unrelate(builder, owner) {
    return new _BelongsToOneUnrelateOperation2.default(builder.knex(), 'unrelate', {
      relation: this,
      owner: owner
    });
  };

  return BelongsToOneRelation;
}(_Relation3.default);

exports.default = BelongsToOneRelation;