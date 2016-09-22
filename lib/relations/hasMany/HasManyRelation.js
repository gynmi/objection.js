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

var _HasManyInsertOperation = require('./HasManyInsertOperation');

var _HasManyInsertOperation2 = _interopRequireDefault(_HasManyInsertOperation);

var _HasManyRelateOperation = require('./HasManyRelateOperation');

var _HasManyRelateOperation2 = _interopRequireDefault(_HasManyRelateOperation);

var _HasManyUnrelateOperation = require('./HasManyUnrelateOperation');

var _HasManyUnrelateOperation2 = _interopRequireDefault(_HasManyUnrelateOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HasManyRelation = function (_Relation) {
  (0, _inherits3.default)(HasManyRelation, _Relation);

  function HasManyRelation() {
    (0, _classCallCheck3.default)(this, HasManyRelation);
    return (0, _possibleConstructorReturn3.default)(this, _Relation.apply(this, arguments));
  }

  HasManyRelation.prototype.createRelationProp = function createRelationProp(owners, related) {
    var relatedByOwnerId = (0, _create2.default)(null);

    for (var i = 0, l = related.length; i < l; ++i) {
      var rel = related[i];
      var key = rel.$propKey(this.relatedProp);
      var arr = relatedByOwnerId[key];

      if (!arr) {
        arr = [];
        relatedByOwnerId[key] = arr;
      }

      arr.push(rel);
    }

    for (var _i = 0, _l = owners.length; _i < _l; ++_i) {
      var own = owners[_i];
      var _key = own.$propKey(this.ownerProp);

      own[this.name] = relatedByOwnerId[_key] || [];
    }
  };

  HasManyRelation.prototype.appendRelationProp = function appendRelationProp(owner, related) {
    owner[this.name] = this.mergeModels(owner[this.name], related);
  };

  HasManyRelation.prototype.insert = function insert(builder, owner) {
    return new _HasManyInsertOperation2.default(builder.knex(), 'insert', {
      relation: this,
      owner: owner
    });
  };

  HasManyRelation.prototype.relate = function relate(builder, owner) {
    return new _HasManyRelateOperation2.default(builder.knex(), 'relate', {
      relation: this,
      owner: owner
    });
  };

  HasManyRelation.prototype.unrelate = function unrelate(builder, owner) {
    return new _HasManyUnrelateOperation2.default(builder.knex(), 'unrelate', {
      relation: this,
      owner: owner
    });
  };

  return HasManyRelation;
}(_Relation3.default);

exports.default = HasManyRelation;