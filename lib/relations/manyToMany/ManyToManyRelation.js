'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _desc, _value, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Relation2 = require('../Relation');

var _Relation3 = _interopRequireDefault(_Relation2);

var _inheritModel = require('../../model/inheritModel');

var _inheritModel2 = _interopRequireDefault(_inheritModel);

var _dbUtils = require('../../utils/dbUtils');

var _memoize = require('../../utils/decorators/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _ManyToManyFindOperation = require('./ManyToManyFindOperation');

var _ManyToManyFindOperation2 = _interopRequireDefault(_ManyToManyFindOperation);

var _ManyToManyInsertOperation = require('./ManyToManyInsertOperation');

var _ManyToManyInsertOperation2 = _interopRequireDefault(_ManyToManyInsertOperation);

var _ManyToManyRelateOperation = require('./ManyToManyRelateOperation');

var _ManyToManyRelateOperation2 = _interopRequireDefault(_ManyToManyRelateOperation);

var _ManyToManyUnrelateOperation = require('./ManyToManyUnrelateOperation');

var _ManyToManyUnrelateOperation2 = _interopRequireDefault(_ManyToManyUnrelateOperation);

var _ManyToManyUnrelateSqliteOperation = require('./ManyToManyUnrelateSqliteOperation');

var _ManyToManyUnrelateSqliteOperation2 = _interopRequireDefault(_ManyToManyUnrelateSqliteOperation);

var _ManyToManyUpdateOperation = require('./ManyToManyUpdateOperation');

var _ManyToManyUpdateOperation2 = _interopRequireDefault(_ManyToManyUpdateOperation);

var _ManyToManyUpdateSqliteOperation = require('./ManyToManyUpdateSqliteOperation');

var _ManyToManyUpdateSqliteOperation2 = _interopRequireDefault(_ManyToManyUpdateSqliteOperation);

var _ManyToManyDeleteOperation = require('./ManyToManyDeleteOperation');

var _ManyToManyDeleteOperation2 = _interopRequireDefault(_ManyToManyDeleteOperation);

var _ManyToManyDeleteSqliteOperation = require('./ManyToManyDeleteSqliteOperation');

var _ManyToManyDeleteSqliteOperation2 = _interopRequireDefault(_ManyToManyDeleteSqliteOperation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var sqliteBuiltInRowId = '_rowid_';

var ManyToManyRelation = (_class = function (_Relation) {
  (0, _inherits3.default)(ManyToManyRelation, _Relation);

  function ManyToManyRelation() {
    (0, _classCallCheck3.default)(this, ManyToManyRelation);
    return (0, _possibleConstructorReturn3.default)(this, _Relation.apply(this, arguments));
  }

  ManyToManyRelation.prototype.setMapping = function setMapping(mapping) {
    var retVal = _Relation.prototype.setMapping.call(this, mapping);

    // Avoid require loop and import here.
    var Model = require(__dirname + '/../../model/Model').default;

    if (!_lodash2.default.isObject(mapping.join.through)) {
      this.throwError('join must have the `through` that describes the join table.');
    }

    if (!mapping.join.through.from || !mapping.join.through.to) {
      this.throwError('join.through must be an object that describes the join table. For example: {from: "JoinTable.someId", to: "JoinTable.someOtherId"}');
    }

    var joinFrom = this.parseReference(mapping.join.from);
    var joinTableFrom = this.parseReference(mapping.join.through.from);
    var joinTableTo = this.parseReference(mapping.join.through.to);
    var joinTableExtra = mapping.join.through.extra || [];

    if (!joinTableFrom.table || _lodash2.default.isEmpty(joinTableFrom.columns)) {
      this.throwError('join.through.from must have format JoinTable.columnName. For example "JoinTable.someId" or in case of composite key ["JoinTable.a", "JoinTable.b"].');
    }

    if (!joinTableTo.table || _lodash2.default.isEmpty(joinTableTo.columns)) {
      this.throwError('join.through.to must have format JoinTable.columnName. For example "JoinTable.someId" or in case of composite key ["JoinTable.a", "JoinTable.b"].');
    }

    if (joinTableFrom.table !== joinTableTo.table) {
      this.throwError('join.through `from` and `to` must point to the same join table.');
    }

    this.joinTable = joinTableFrom.table;
    this.joinTableExtraCols = joinTableExtra;

    if (joinFrom.table === this.ownerModelClass.tableName) {
      this.joinTableOwnerCol = joinTableFrom.columns;
      this.joinTableRelatedCol = joinTableTo.columns;
    } else {
      this.joinTableRelatedCol = joinTableFrom.columns;
      this.joinTableOwnerCol = joinTableTo.columns;
    }

    if (mapping.join.through.modelClass) {
      this._joinTableModelClass = this.resolveModel(Model, mapping.join.through.modelClass, 'join.through.modelClass');
    } else {
      this._joinTableModelClass = (0, _inheritModel2.default)(Model);
      this._joinTableModelClass.tableName = this.joinTable;
      // We cannot know if the join table has a primary key. Therefore we set some
      // known column as the idColumn so that inserts will work.
      this._joinTableModelClass.idColumn = this.joinTableRelatedCol;
    }

    this.joinTableOwnerProp = this.propertyName(this.joinTableOwnerCol, this._joinTableModelClass);
    this.joinTableRelatedProp = this.propertyName(this.joinTableRelatedCol, this._joinTableModelClass);
    this.joinTableExtraProps = this.propertyName(this.joinTableExtraCols, this._joinTableModelClass);

    return retVal;
  };

  /**
   * @returns {Array.<string>}
   */


  ManyToManyRelation.prototype.fullJoinTableOwnerCol = function fullJoinTableOwnerCol() {
    var _this2 = this;

    return this.joinTableOwnerCol.map(function (col) {
      return _this2.joinTable + '.' + col;
    });
  };

  /**
   * @returns {Array.<string>}
   */


  ManyToManyRelation.prototype.fullJoinTableRelatedCol = function fullJoinTableRelatedCol() {
    var _this3 = this;

    return this.joinTableRelatedCol.map(function (col) {
      return _this3.joinTable + '.' + col;
    });
  };

  /**
   * @returns {Array.<string>}
   */


  ManyToManyRelation.prototype.fullJoinTableExtraCols = function fullJoinTableExtraCols() {
    var _this4 = this;

    return this.joinTableExtraCols.map(function (col) {
      return _this4.joinTable + '.' + col;
    });
  };

  /**
   * @returns {string}
   */


  ManyToManyRelation.prototype.joinTableAlias = function joinTableAlias() {
    return this.joinTable + '_rel_' + this.name;
  };

  /**
   * @returns {ManyToManyRelation}
   */


  ManyToManyRelation.prototype.bindKnex = function bindKnex(knex) {
    var bound = _Relation.prototype.bindKnex.call(this, knex);
    bound._joinTableModelClass = this._joinTableModelClass.bindKnex(knex);
    return bound;
  };

  /**
   * @returns {QueryBuilder}
   */


  ManyToManyRelation.prototype.findQuery = function findQuery(builder, opt) {
    var _this5 = this;

    builder.join(this.joinTable, function (join) {
      var fullRelatedCol = _this5.fullRelatedCol();
      var fullJoinTableRelatedCol = _this5.fullJoinTableRelatedCol();

      for (var i = 0, l = fullJoinTableRelatedCol.length; i < l; ++i) {
        join.on(fullJoinTableRelatedCol[i], fullRelatedCol[i]);
      }
    });

    if (opt.isColumnRef) {
      var fullJoinTableOwnerCol = this.fullJoinTableOwnerCol();

      for (var i = 0, l = fullJoinTableOwnerCol.length; i < l; ++i) {
        builder.whereRef(fullJoinTableOwnerCol[i], opt.ownerIds[i]);
      }
    } else {
      var hasIds = false;

      for (var _i = 0, _l = opt.ownerIds.length; _i < _l; ++_i) {
        var id = opt.ownerIds[_i];

        if (id) {
          hasIds = true;
          break;
        }
      }

      if (hasIds) {
        builder.whereInComposite(this.fullJoinTableOwnerCol(), opt.ownerIds);
      } else {
        builder.resolve([]);
      }
    }

    return builder.modify(this.modify);
  };

  /**
   * @returns {QueryBuilder}
   */


  ManyToManyRelation.prototype.join = function join(builder, opt) {
    opt = opt || {};

    opt.joinOperation = opt.joinOperation || 'join';
    opt.relatedTableAlias = opt.relatedTableAlias || this.relatedTableAlias();
    opt.relatedJoinSelectQuery = opt.relatedJoinSelectQuery || this.relatedModelClass.query();
    opt.relatedTable = opt.relatedTable || this.relatedModelClass.tableName;
    opt.ownerTable = opt.ownerTable || this.ownerModelClass.tableName;
    opt.joinTableAlias = opt.joinTableAlias || opt.relatedTableAlias + '_join';

    var joinTableAsAlias = this.joinTable + ' as ' + opt.joinTableAlias;
    var joinTableOwnerCol = this.joinTableOwnerCol.map(function (col) {
      return opt.joinTableAlias + '.' + col;
    });
    var joinTableRelatedCol = this.joinTableRelatedCol.map(function (col) {
      return opt.joinTableAlias + '.' + col;
    });

    var relatedCol = this.relatedCol.map(function (col) {
      return opt.relatedTableAlias + '.' + col;
    });
    var ownerCol = this.ownerCol.map(function (col) {
      return opt.ownerTable + '.' + col;
    });

    var relatedJoinSelectQuery = opt.relatedJoinSelectQuery.modify(this.modify).as(opt.relatedTableAlias);

    return builder[opt.joinOperation](joinTableAsAlias, function (join) {
      for (var i = 0, l = joinTableOwnerCol.length; i < l; ++i) {
        join.on(joinTableOwnerCol[i], ownerCol[i]);
      }
    })[opt.joinOperation](relatedJoinSelectQuery, function (join) {
      for (var i = 0, l = joinTableRelatedCol.length; i < l; ++i) {
        join.on(joinTableRelatedCol[i], relatedCol[i]);
      }
    });
  };

  ManyToManyRelation.prototype.find = function find(builder, owners) {
    return new _ManyToManyFindOperation2.default(builder.knex(), 'find', {
      relation: this,
      owners: owners
    });
  };

  ManyToManyRelation.prototype.insert = function insert(builder, owner) {
    return new _ManyToManyInsertOperation2.default(builder.knex(), 'insert', {
      relation: this,
      owner: owner
    });
  };

  ManyToManyRelation.prototype.update = function update(builder, owner) {
    if ((0, _dbUtils.isSqlite)(builder.knex())) {
      return new _ManyToManyUpdateSqliteOperation2.default(builder.knex(), 'update', {
        relation: this,
        owner: owner
      });
    } else {
      return new _ManyToManyUpdateOperation2.default(builder.knex(), 'update', {
        relation: this,
        owner: owner
      });
    }
  };

  ManyToManyRelation.prototype.patch = function patch(builder, owner) {
    if ((0, _dbUtils.isSqlite)(builder.knex())) {
      return new _ManyToManyUpdateSqliteOperation2.default(builder.knex(), 'patch', {
        relation: this,
        owner: owner,
        modelOptions: { patch: true }
      });
    } else {
      return new _ManyToManyUpdateOperation2.default(builder.knex(), 'patch', {
        relation: this,
        owner: owner,
        modelOptions: { patch: true }
      });
    }
  };

  ManyToManyRelation.prototype.delete = function _delete(builder, owner) {
    if ((0, _dbUtils.isSqlite)(builder.knex())) {
      return new _ManyToManyDeleteSqliteOperation2.default(builder.knex(), 'delete', {
        relation: this,
        owner: owner
      });
    } else {
      return new _ManyToManyDeleteOperation2.default(builder.knex(), 'delete', {
        relation: this,
        owner: owner
      });
    }
  };

  ManyToManyRelation.prototype.relate = function relate(builder, owner) {
    return new _ManyToManyRelateOperation2.default(builder.knex(), 'relate', {
      relation: this,
      owner: owner
    });
  };

  ManyToManyRelation.prototype.unrelate = function unrelate(builder, owner) {
    if ((0, _dbUtils.isSqlite)(builder.knex())) {
      return new _ManyToManyUnrelateSqliteOperation2.default(builder.knex(), 'unrelate', {
        relation: this,
        owner: owner
      });
    } else {
      return new _ManyToManyUnrelateOperation2.default(builder.knex(), 'unrelate', {
        relation: this,
        owner: owner
      });
    }
  };

  ManyToManyRelation.prototype.selectForModify = function selectForModify(builder, owner) {
    var ownerId = owner.$values(this.ownerProp);

    var idQuery = this.joinTableModelClass.query().childQueryOf(builder).select(this.fullJoinTableRelatedCol()).whereComposite(this.fullJoinTableOwnerCol(), ownerId);

    return builder.whereInComposite(this.fullRelatedCol(), idQuery);
  };

  ManyToManyRelation.prototype.selectForModifySqlite = function selectForModifySqlite(builder, owner) {
    var _this6 = this;

    var relatedTable = this.relatedModelClass.tableName;
    var relatedTableAlias = this.relatedTableAlias();
    var relatedTableAsAlias = relatedTable + ' as ' + relatedTableAlias;
    var relatedTableAliasRowId = relatedTableAlias + '.' + sqliteBuiltInRowId;
    var relatedTableRowId = relatedTable + '.' + sqliteBuiltInRowId;

    var selectRelatedQuery = this.joinTableModelClass.query().childQueryOf(builder).select(relatedTableAliasRowId).whereComposite(this.fullJoinTableOwnerCol(), owner.$values(this.ownerProp)).join(relatedTableAsAlias, function (join) {
      var fullJoinTableRelatedCols = _this6.fullJoinTableRelatedCol();
      var fullRelatedCol = _this6.fullRelatedCol();

      for (var i = 0, l = fullJoinTableRelatedCols.length; i < l; ++i) {
        join.on(fullJoinTableRelatedCols[i], fullRelatedCol[i]);
      }
    });

    return builder.whereInComposite(relatedTableRowId, selectRelatedQuery);
  };

  ManyToManyRelation.prototype.createJoinModels = function createJoinModels(ownerId, related) {
    var joinModels = new Array(related.length);

    for (var i = 0, lr = related.length; i < lr; ++i) {
      var rel = related[i];
      var joinModel = {};

      for (var j = 0, lp = this.joinTableOwnerProp.length; j < lp; ++j) {
        joinModel[this.joinTableOwnerProp[j]] = ownerId[j];
      }

      for (var _j = 0, _lp = this.joinTableRelatedProp.length; _j < _lp; ++_j) {
        joinModel[this.joinTableRelatedProp[_j]] = rel[this.relatedProp[_j]];
      }

      for (var _j2 = 0, _lp2 = this.joinTableExtraProps.length; _j2 < _lp2; ++_j2) {
        var prop = this.joinTableExtraProps[_j2];
        var extraValue = rel[prop];

        if (!_lodash2.default.isUndefined(extraValue)) {
          joinModel[prop] = extraValue;
        }
      }

      joinModels[i] = joinModel;
    }

    return joinModels;
  };

  ManyToManyRelation.prototype.omitExtraProps = function omitExtraProps(models) {
    if (!_lodash2.default.isEmpty(this.joinTableExtraProps)) {
      for (var i = 0, l = models.length; i < l; ++i) {
        models[i].$omitFromDatabaseJson(this.joinTableExtraProps);
      }
    }
  };

  return ManyToManyRelation;
}(_Relation3.default), (_applyDecoratedDescriptor(_class.prototype, 'fullJoinTableOwnerCol', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fullJoinTableOwnerCol'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fullJoinTableRelatedCol', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fullJoinTableRelatedCol'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fullJoinTableExtraCols', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fullJoinTableExtraCols'), _class.prototype)), _class);
exports.default = ManyToManyRelation;