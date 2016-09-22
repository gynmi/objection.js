'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _desc, _value, _class;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _memoize = require('../utils/decorators/memoize');

var _memoize2 = _interopRequireDefault(_memoize);

var _classUtils = require('../utils/classUtils');

var _hiddenData = require('../utils/hiddenData');

var _QueryBuilder = require('../queryBuilder/QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var _RelationFindOperation = require('./RelationFindOperation');

var _RelationFindOperation2 = _interopRequireDefault(_RelationFindOperation);

var _RelationUpdateOperation = require('./RelationUpdateOperation');

var _RelationUpdateOperation2 = _interopRequireDefault(_RelationUpdateOperation);

var _RelationDeleteOperation = require('./RelationDeleteOperation');

var _RelationDeleteOperation2 = _interopRequireDefault(_RelationDeleteOperation);

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

/**
 * @typedef {Object} RelationJoin

 * @property {string|Array.<string>} from
 * @property {string|Array.<string>} to
 * @property {Object} through
 * @property {Constructor.<Model>} through.modelClass
 * @property {string|Array.<string>} through.from
 * @property {string|Array.<string>} through.to
 * @property {Array.<string>} through.extra
 */

/**
 * @typedef {Object} RelationMapping
 *
 * @property {Constructor.<Model>|string} modelClass
 * @property {Relation} relation
 * @property {Object|function(QueryBuilder)} modify
 * @property {Object|function(QueryBuilder)} filter
 * @property {RelationJoin} [join]
 */

/**
 * @abstract
 */
var Relation = (_class = function () {
  function Relation(relationName, OwnerClass) {
    (0, _classCallCheck3.default)(this, Relation);

    /**
     * @type {string}
     */
    this.name = relationName;

    /**
     * @type {Constructor.<Model>}
     */
    this.ownerModelClass = OwnerClass;

    /**
     * @type {Constructor.<Model>}
     */
    this.relatedModelClass = null;

    /**
     * @type {Constructor.<Model>}
     */
    this._joinTableModelClass = null;

    /**
     * @type {Array.<string>}
     */
    this.ownerCol = null;

    /**
     * @type {Array.<string>}
     */
    this.ownerProp = null;

    /**
     * @type {Array.<string>}
     */
    this.relatedCol = null;

    /**
     * @type {Array.<string>}
     */
    this.relatedProp = null;

    /**
     * @type {string}
     */
    this.joinTable = null;

    /**
     * @type {Array.<string>}
     */
    this.joinTableOwnerCol = null;

    /**
     * @type {Array.<string>}
     */
    this.joinTableOwnerProp = null;

    /**
     * @type {Array.<string>}
     */
    this.joinTableRelatedCol = null;

    /**
     * @type {Array.<string>}
     */
    this.joinTableRelatedProp = null;

    /**
     * @type {Array.<string>}
     */
    this.joinTableExtraCols = null;

    /**
     * @type {Array.<string>}
     */
    this.joinTableExtraProps = null;

    /**
     * @type {function (QueryBuilder)}
     */
    this.modify = null;

    (0, _hiddenData.init)(this);
  }

  /**
   * @param {function=} subclassConstructor
   * @return {Constructor.<Model>}
   */


  Relation.extend = function extend(subclassConstructor) {
    (0, _classUtils.inherits)(subclassConstructor, this);
    return subclassConstructor;
  };

  /**
   * @param {RelationMapping} mapping
   */


  Relation.prototype.setMapping = function setMapping(mapping) {
    // Avoid require loop and import here.
    var Model = require(__dirname + '/../model/Model').default;

    if (!(0, _classUtils.isSubclassOf)(this.ownerModelClass, Model)) {
      this.throwError('Relation\'s owner is not a subclass of Model');
    }

    if (!mapping.modelClass) {
      this.throwError('modelClass is not defined');
    }

    this.relatedModelClass = this.resolveModel(Model, mapping.modelClass, 'modelClass');

    if (!mapping.relation) {
      this.throwError('relation is not defined');
    }

    if (!(0, _classUtils.isSubclassOf)(mapping.relation, Relation)) {
      this.throwError('relation is not a subclass of Relation');
    }

    if (!mapping.join || !mapping.join.from || !mapping.join.to) {
      this.throwError('join must be an object that maps the columns of the related models together. For example: {from: "SomeTable.id", to: "SomeOtherTable.someModelId"}');
    }

    var joinOwner = null;
    var joinRelated = null;

    var joinFrom = this.parseReference(mapping.join.from);
    var joinTo = this.parseReference(mapping.join.to);

    if (!joinFrom.table || _lodash2.default.isEmpty(joinFrom.columns)) {
      this.throwError('join.from must have format TableName.columnName. For example "SomeTable.id" or in case of composite key ["SomeTable.a", "SomeTable.b"].');
    }

    if (!joinTo.table || _lodash2.default.isEmpty(joinTo.columns)) {
      this.throwError('join.to must have format TableName.columnName. For example "SomeTable.id" or in case of composite key ["SomeTable.a", "SomeTable.b"].');
    }

    if (joinFrom.table === this.ownerModelClass.tableName) {
      joinOwner = joinFrom;
      joinRelated = joinTo;
    } else if (joinTo.table === this.ownerModelClass.tableName) {
      joinOwner = joinTo;
      joinRelated = joinFrom;
    } else {
      this.throwError('join: either `from` or `to` must point to the owner model table.');
    }

    if (joinRelated.table !== this.relatedModelClass.tableName) {
      this.throwError('join: either `from` or `to` must point to the related model table.');
    }

    this.ownerCol = joinOwner.columns;
    this.ownerProp = this.propertyName(this.ownerCol, this.ownerModelClass);
    this.relatedCol = joinRelated.columns;
    this.relatedProp = this.propertyName(this.relatedCol, this.relatedModelClass);
    this.modify = this.parseModify(mapping);
  };

  /**
   * @return {boolean}
   */


  Relation.prototype.isOneToOne = function isOneToOne() {
    return false;
  };

  /**
   * @returns {knex}
   */


  Relation.prototype.knex = function knex() {
    return this.ownerModelClass.knex();
  };

  /**
   * @type {Constructor.<Model>}
   */


  Relation.prototype.fullOwnerCol = function fullOwnerCol() {
    var _this = this;

    return this.ownerCol.map(function (col) {
      return _this.ownerModelClass.tableName + '.' + col;
    });
  };

  /**
   * @returns {Array.<string>}
   */


  Relation.prototype.fullRelatedCol = function fullRelatedCol() {
    var _this2 = this;

    return this.relatedCol.map(function (col) {
      return _this2.relatedModelClass.tableName + '.' + col;
    });
  };

  /**
   * @returns {string}
   */


  Relation.prototype.relatedTableAlias = function relatedTableAlias() {
    return this.relatedModelClass.tableName + '_rel_' + this.name;
  };

  /**
   * @returns {Relation}
   */


  Relation.prototype.clone = function clone() {
    var relation = new this.constructor(this.name, this.ownerModelClass);

    relation.relatedModelClass = this.relatedModelClass;
    relation.ownerCol = this.ownerCol;
    relation.ownerProp = this.ownerProp;
    relation.relatedCol = this.relatedCol;
    relation.relatedProp = this.relatedProp;
    relation.modify = this.modify;

    relation._joinTableModelClass = this._joinTableModelClass;
    relation.joinTable = this.joinTable;
    relation.joinTableOwnerCol = this.joinTableOwnerCol;
    relation.joinTableOwnerProp = this.joinTableOwnerProp;
    relation.joinTableRelatedCol = this.joinTableRelatedCol;
    relation.joinTableRelatedProp = this.joinTableRelatedProp;
    relation.joinTableExtraCols = this.joinTableExtraCols;
    relation.joinTableExtraProps = this.joinTableExtraProps;

    (0, _hiddenData.copyHiddenData)(this, relation);

    return relation;
  };

  /**
   * @param {knex} knex
   * @returns {Relation}
   */


  Relation.prototype.bindKnex = function bindKnex(knex) {
    var bound = this.clone();

    bound.relatedModelClass = this.relatedModelClass.bindKnex(knex);
    bound.ownerModelClass = this.ownerModelClass.bindKnex(knex);

    return bound;
  };

  /**
   * @param {QueryBuilder} builder
   * @param {object} opt
   * @param {Array.<string>|Array.<Array.<(string|number)>>} opt.ownerIds
   * @param {boolean=} opt.isColumnRef
   * @returns {QueryBuilder}
   */


  Relation.prototype.findQuery = function findQuery(builder, opt) {
    var fullRelatedCol = this.fullRelatedCol();

    if (opt.isColumnRef) {
      for (var i = 0, l = fullRelatedCol.length; i < l; ++i) {
        builder.whereRef(fullRelatedCol[i], opt.ownerIds[i]);
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
        builder.whereInComposite(fullRelatedCol, opt.ownerIds);
      } else {
        builder.resolve([]);
      }
    }

    return builder.modify(this.modify);
  };

  /**
   * @param {QueryBuilder} builder
   * @param {object=} opt
   * @returns {QueryBuilder}
   */


  Relation.prototype.join = function join(builder, opt) {
    opt = opt || {};

    opt.joinOperation = opt.joinOperation || 'join';
    opt.relatedTableAlias = opt.relatedTableAlias || this.relatedTableAlias();
    opt.relatedJoinSelectQuery = opt.relatedJoinSelectQuery || this.relatedModelClass.query();
    opt.relatedTable = opt.relatedTable || this.relatedModelClass.tableName;
    opt.ownerTable = opt.ownerTable || this.ownerModelClass.tableName;

    var relatedCol = this.relatedCol.map(function (col) {
      return opt.relatedTableAlias + '.' + col;
    });
    var ownerCol = this.ownerCol.map(function (col) {
      return opt.ownerTable + '.' + col;
    });

    var relatedJoinSelectQuery = opt.relatedJoinSelectQuery.modify(this.modify).as(opt.relatedTableAlias);

    return builder[opt.joinOperation](relatedJoinSelectQuery, function (join) {
      for (var i = 0, l = relatedCol.length; i < l; ++i) {
        join.on(relatedCol[i], '=', ownerCol[i]);
      }
    });
  };

  /* istanbul ignore next */
  /**
   * @abstract
   * @param {QueryBuilder} builder
   * @param {Model} owner
   * @returns {QueryBuilderOperation}
   */


  Relation.prototype.insert = function insert(builder, owner) {
    this.throwError('not implemented');
  };

  /**
   * @param {QueryBuilder} builder
   * @param {Model} owner
   * @returns {QueryBuilderOperation}
   */


  Relation.prototype.update = function update(builder, owner) {
    return new _RelationUpdateOperation2.default(builder.knex(), 'update', {
      relation: this,
      owner: owner
    });
  };

  /**
   * @param {QueryBuilder} builder
   * @param {Model} owner
   * @returns {QueryBuilderOperation}
   */


  Relation.prototype.patch = function patch(builder, owner) {
    return new _RelationUpdateOperation2.default(builder.knex(), 'patch', {
      relation: this,
      owner: owner,
      modelOptions: { patch: true }
    });
  };

  /**
   * @param {QueryBuilder} builder
   * @param {Array.<Model>} owners
   * @returns {QueryBuilderOperation}
   */


  Relation.prototype.find = function find(builder, owners) {
    return new _RelationFindOperation2.default(builder.knex(), 'find', {
      relation: this,
      owners: owners
    });
  };

  /**
   * @param {QueryBuilder} builder
   * @param {Model} owner
   * @returns {QueryBuilderOperation}
   */


  Relation.prototype.delete = function _delete(builder, owner) {
    return new _RelationDeleteOperation2.default(builder.knex(), 'delete', {
      relation: this,
      owner: owner
    });
  };

  /* istanbul ignore next */
  /**
   * @abstract
   * @param {QueryBuilder} builder
   * @param {Model} owner
   * @returns {QueryBuilderOperation}
   */


  Relation.prototype.relate = function relate(builder, owner) {
    this.throwError('not implemented');
  };

  /* istanbul ignore next */
  /**
   * @abstract
   * @param {QueryBuilder} builder
   * @param {Model} owner
   * @returns {QueryBuilderOperation}
   */


  Relation.prototype.unrelate = function unrelate(builder, owner) {
    this.throwError('not implemented');
  };

  /* istanbul ignore next */
  /**
   * @abstract
   * @protected
   */


  Relation.prototype.createRelationProp = function createRelationProp(owners, related) {
    this.throwError('not implemented');
  };

  /**
   * @protected
   */


  Relation.prototype.propertyName = function propertyName(columns, modelClass) {
    var _this3 = this;

    return columns.map(function (column) {
      var propertyName = modelClass.columnNameToPropertyName(column);

      if (!propertyName) {
        throw new Error(modelClass.name + '.$parseDatabaseJson probably transforms the value of the column ' + column + '.' + ' This is a no-no because ' + column + ' is needed in the relation ' + _this3.ownerModelClass.tableName + '.' + _this3.name);
      }

      return propertyName;
    });
  };

  /**
   * @protected
   */


  Relation.prototype.parseModify = function parseModify(mapping) {
    var modify = mapping.modify || mapping.filter;

    if (_lodash2.default.isFunction(modify)) {
      return modify;
    } else if (_lodash2.default.isObject(modify)) {
      return function (queryBuilder) {
        queryBuilder.where(modify);
      };
    } else {
      return _lodash2.default.noop;
    }
  };

  /**
   * @protected
   */


  Relation.prototype.parseReference = function parseReference(ref) {
    if (!_lodash2.default.isArray(ref)) {
      ref = [ref];
    }

    var table = null;
    var columns = [];

    for (var i = 0; i < ref.length; ++i) {
      var refItem = ref[i];
      var ndx = refItem.lastIndexOf('.');

      var tableName = refItem.substr(0, ndx).trim();
      var columnName = refItem.substr(ndx + 1, refItem.length).trim();

      if (!tableName || table && table !== tableName || !columnName) {
        return {
          table: null,
          columns: []
        };
      } else {
        table = tableName;
      }

      columns.push(columnName);
    }

    return {
      table: table,
      columns: columns
    };
  };

  /**
   * @protected
   */


  Relation.prototype.mergeModels = function mergeModels(models1, models2) {
    var modelClass = void 0;

    models1 = _lodash2.default.compact(models1);
    models2 = _lodash2.default.compact(models2);

    if (_lodash2.default.isEmpty(models1) && _lodash2.default.isEmpty(models2)) {
      return [];
    }

    if (!_lodash2.default.isEmpty(models1)) {
      modelClass = models1[0].constructor;
    } else {
      modelClass = models2[0].constructor;
    }

    var idProperty = modelClass.getIdPropertyArray();
    var modelsById = (0, _create2.default)(null);

    for (var i = 0, l = models1.length; i < l; ++i) {
      var model = models1[i];
      var key = model.$propKey(idProperty);

      modelsById[key] = model;
    }

    for (var _i2 = 0, _l2 = models2.length; _i2 < _l2; ++_i2) {
      var _model = models2[_i2];
      var _key = _model.$propKey(idProperty);

      modelsById[_key] = _model;
    }

    return _lodash2.default.sortBy(_lodash2.default.values(modelsById), idProperty);
  };

  /**
   * @protected
   */


  Relation.prototype.resolveModel = function resolveModel(Model, modelClass, logPrefix) {
    var _this4 = this;

    var requireModel = function requireModel(path) {
      var ModelClass = void 0;

      try {
        // babel 6 style of exposing es6 exports to commonjs https://github.com/babel/babel/issues/2683
        var module = require(path);

        ModelClass = (0, _classUtils.isSubclassOf)(module.default, Model) ? module.default : module;
      } catch (err) {
        return null;
      }

      if (!(0, _classUtils.isSubclassOf)(ModelClass, Model)) {
        return null;
      }

      return ModelClass;
    };

    if (_lodash2.default.isString(modelClass)) {
      var _ret = function () {
        var ModelClass = null;

        if (isAbsolutePath(modelClass)) {
          ModelClass = requireModel(modelClass);
        } else {
          // If the path is not a absolute, try the modelPaths of the owner model class.
          _lodash2.default.each(_this4.ownerModelClass.modelPaths, function (modelPath) {
            ModelClass = requireModel(_path2.default.join(modelPath, modelClass));

            if ((0, _classUtils.isSubclassOf)(ModelClass, Model)) {
              // Break the loop.
              return false;
            }
          });
        }

        if (!(0, _classUtils.isSubclassOf)(ModelClass, Model)) {
          _this4.throwError(logPrefix + ': ' + modelClass + ' is an invalid file path to a model class');
        }

        return {
          v: ModelClass
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
    } else {
      if (!(0, _classUtils.isSubclassOf)(modelClass, Model)) {
        this.throwError(logPrefix + ' is not a subclass of Model or a file path to a module that exports one.');
      }

      return modelClass;
    }
  };

  /**
   * @protected
   */


  Relation.prototype.throwError = function throwError(message) {
    if (this.ownerModelClass && this.ownerModelClass.name && this.name) {
      throw new Error(this.ownerModelClass.name + '.relationMappings.' + this.name + ': ' + message);
    } else {
      throw new Error(this.constructor.name + ': ' + message);
    }
  };

  (0, _createClass3.default)(Relation, [{
    key: 'joinTableModelClass',
    get: function get() {
      var knex = this.ownerModelClass.knex();

      if (knex && knex !== this._joinTableModelClass.knex()) {
        return this._joinTableModelClass.bindKnex(knex);
      } else {
        return this._joinTableModelClass;
      }
    }

    /**
     * @returns {Array.<string>}
     */

  }]);
  return Relation;
}(), (_applyDecoratedDescriptor(_class.prototype, 'fullOwnerCol', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fullOwnerCol'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'fullRelatedCol', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'fullRelatedCol'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'relatedTableAlias', [_memoize2.default], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, 'relatedTableAlias'), _class.prototype)), _class);
exports.default = Relation;


function isAbsolutePath(pth) {
  return _path2.default.normalize(pth + '/') === _path2.default.normalize(_path2.default.resolve(pth) + '/');
}