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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _FindOperation2 = require('../../queryBuilder/operations/FindOperation');

var _FindOperation3 = _interopRequireDefault(_FindOperation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ownerJoinColumnAliasPrefix = 'objectiontmpjoin';

var ManyToManyFindOperation = function (_FindOperation) {
  (0, _inherits3.default)(ManyToManyFindOperation, _FindOperation);

  function ManyToManyFindOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, ManyToManyFindOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _FindOperation.call(this, knex, name, opt));

    _this.relation = opt.relation;
    _this.owners = opt.owners;

    _this.relatedIdxByOwnerId = null;
    _this.ownerJoinColumnAlias = new Array(_this.relation.joinTableOwnerCol.length);

    for (var i = 0, l = _this.relation.joinTableOwnerCol.length; i < l; ++i) {
      _this.ownerJoinColumnAlias[i] = ownerJoinColumnAliasPrefix + i;
    }
    return _this;
  }

  ManyToManyFindOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {
    var ids = new Array(this.owners.length);

    for (var i = 0, l = this.owners.length; i < l; ++i) {
      ids[i] = this.owners[i].$values(this.relation.ownerProp);
    }

    if (!builder.has(/select/)) {
      // If the user hasn't specified a select clause, select the related model's columns.
      // If we don't do this we also get the join table's columns.
      builder.select(this.relation.relatedModelClass.tableName + '.*');

      var extraCols = this.relation.fullJoinTableExtraCols();
      // Also select all extra columns.
      for (var _i = 0, _l = extraCols.length; _i < _l; ++_i) {
        builder.select(extraCols[_i]);
      }
    }

    this.relation.findQuery(builder, {
      ownerIds: _lodash2.default.uniqBy(ids, join)
    });

    var fullJoinTableOwnerCol = this.relation.fullJoinTableOwnerCol();
    // We must select the owner join columns so that we know for which owner model the related
    // models belong to after the requests.
    for (var _i2 = 0, _l2 = fullJoinTableOwnerCol.length; _i2 < _l2; ++_i2) {
      builder.select(fullJoinTableOwnerCol[_i2] + ' as ' + this.ownerJoinColumnAlias[_i2]);
    }
  };

  ManyToManyFindOperation.prototype.onRawResult = function onRawResult(builder, rows) {
    var relatedIdxByOwnerId = (0, _create2.default)(null);
    var propKey = this.relation.relatedModelClass.prototype.$propKey;

    for (var i = 0, l = rows.length; i < l; ++i) {
      var row = rows[i];
      var key = propKey.call(row, this.ownerJoinColumnAlias);
      var arr = relatedIdxByOwnerId[key];

      if (!arr) {
        arr = [];
        relatedIdxByOwnerId[key] = arr;
      }

      for (var j = 0, lc = this.ownerJoinColumnAlias.length; j < lc; ++j) {
        delete row[this.ownerJoinColumnAlias[j]];
      }

      arr.push(i);
    }

    this.relatedIdxByOwnerId = relatedIdxByOwnerId;
    return rows;
  };

  ManyToManyFindOperation.prototype.onAfterInternal = function onAfterInternal(builder, related) {
    for (var i = 0, l = this.owners.length; i < l; ++i) {
      var own = this.owners[i];
      var key = own.$propKey(this.relation.ownerProp);
      var idx = this.relatedIdxByOwnerId[key];

      if (idx) {
        var arr = new Array(idx.length);

        for (var j = 0, lr = idx.length; j < lr; ++j) {
          arr[j] = related[idx[j]];
        }

        own[this.relation.name] = arr;
      } else {
        own[this.relation.name] = [];
      }
    }

    return related;
  };

  return ManyToManyFindOperation;
}(_FindOperation3.default);

exports.default = ManyToManyFindOperation;


function join(arr) {
  return arr.join();
}