'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _EagerOperation2 = require('./EagerOperation');

var _EagerOperation3 = _interopRequireDefault(_EagerOperation2);

var _ValidationError = require('../../ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var columnInfo = (0, _create2.default)(null);
var idLengthLimit = 63;
var relationRecursionLimit = 64;

var JoinEagerOperation = function (_EagerOperation) {
  (0, _inherits3.default)(JoinEagerOperation, _EagerOperation);

  function JoinEagerOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, JoinEagerOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _EagerOperation.call(this, knex, name, opt));

    _this.allRelations = null;
    _this.rootModelClass = null;
    _this.pathInfo = (0, _create2.default)(null);
    _this.encodings = (0, _create2.default)(null);
    _this.decodings = (0, _create2.default)(null);
    _this.encIdx = 0;
    _this.opt = _lodash2.default.defaults(opt, {
      minimize: false,
      separator: ':',
      aliases: {}
    });
    return _this;
  }

  JoinEagerOperation.prototype.clone = function clone() {
    var copy = _EagerOperation.prototype.clone.call(this);

    copy.allRelations = this.allRelations;
    copy.allModelClasses = this.allModelClasses;
    copy.rootModelClass = this.rootModelClass;
    copy.pathInfo = this.pathInfo;
    copy.encodings = this.encodings;
    copy.decodings = this.decodings;
    copy.encIdx = this.encIdx;

    return this;
  };

  JoinEagerOperation.prototype.call = function call(builder, args) {
    var ret = _EagerOperation.prototype.call.call(this, builder, args);
    var ModelClass = builder.modelClass();

    if (ret) {
      this.rootModelClass = ModelClass;
      this.allModelClasses = findAllModels(this.expression, ModelClass);
      this.allRelations = findAllRelations(this.expression, ModelClass);
    }

    return ret;
  };

  JoinEagerOperation.prototype.onBeforeInternal = function onBeforeInternal(builder) {
    return fetchColumnInfo(builder, this.allModelClasses);
  };

  JoinEagerOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {
    var builderClone = builder.clone();

    builder.table(this.rootModelClass.tableName + ' as ' + this.rootModelClass.tableName);
    builder.findOptions({ callAfterGetDeeply: true });

    this.build({
      expr: this.expression,
      builder: builder,
      modelClass: builder.modelClass(),
      parentInfo: null,
      relation: null,
      path: '',
      selectFilter: function selectFilter(col) {
        return builderClone.hasSelection(col);
      }
    });
  };

  JoinEagerOperation.prototype.onRawResult = function onRawResult(builder, rows) {
    if (_lodash2.default.isEmpty(rows)) {
      return rows;
    }

    var keyInfoByPath = this.createKeyInfo(rows);
    var pathInfo = _lodash2.default.values(this.pathInfo);

    var tree = (0, _create2.default)(null);
    var stack = (0, _create2.default)(null);

    for (var i = 0, lr = rows.length; i < lr; ++i) {
      var row = rows[i];
      var curBranch = tree;

      for (var j = 0, lp = pathInfo.length; j < lp; ++j) {
        var pInfo = pathInfo[j];
        var id = pInfo.idGetter(row);

        if (!id) {
          break;
        }

        if (pInfo.relation) {
          var parentModel = stack[pInfo.encParentPath];

          curBranch = pInfo.getBranch(parentModel);

          if (!curBranch) {
            curBranch = pInfo.createBranch(parentModel);
          }
        }

        var model = pInfo.getModelFromBranch(curBranch, id);

        if (!model) {
          model = createModel(row, pInfo, keyInfoByPath);
          pInfo.setModelToBranch(curBranch, id, model);
        }

        stack[pInfo.encPath] = model;
      }
    }

    return this.finalize(pathInfo[0], _lodash2.default.values(tree));
  };

  JoinEagerOperation.prototype.createKeyInfo = function createKeyInfo(rows) {
    var keys = (0, _keys2.default)(rows[0]);
    var keyInfo = [];

    for (var i = 0, l = keys.length; i < l; ++i) {
      var key = keys[i];
      var sepIdx = key.lastIndexOf(this.sep);

      if (sepIdx === -1) {
        var pInfo = this.pathInfo[''];
        var col = key;

        if (!pInfo.omitCols[col]) {
          keyInfo.push({
            pInfo: pInfo,
            key: key,
            col: col
          });
        }
      } else {
        var encPath = key.substr(0, sepIdx);
        var path = this.decode(encPath);
        var _col = key.substr(sepIdx + 1);
        var _pInfo = this.pathInfo[path];

        if (!_pInfo.omitCols[_col]) {
          keyInfo.push({
            pInfo: _pInfo,
            key: key,
            col: _col
          });
        }
      }
    }

    return _lodash2.default.groupBy(keyInfo, function (kInfo) {
      return kInfo.pInfo.encPath;
    });
  };

  JoinEagerOperation.prototype.finalize = function finalize(pInfo, models) {
    var relNames = (0, _keys2.default)(pInfo.children);

    if (Array.isArray(models)) {
      for (var m = 0, lm = models.length; m < lm; ++m) {
        this.finalizeOne(pInfo, relNames, models[m]);
      }
    } else {
      this.finalizeOne(pInfo, relNames, models);
    }

    return models;
  };

  JoinEagerOperation.prototype.finalizeOne = function finalizeOne(pInfo, relNames, model) {
    for (var r = 0, lr = relNames.length; r < lr; ++r) {
      var relName = relNames[r];
      var branch = model[relName];
      var childPathInfo = pInfo.children[relName];

      var finalized = childPathInfo.finalizeBranch(branch, model);
      this.finalize(childPathInfo, finalized);
    }
  };

  JoinEagerOperation.prototype.build = function build(_ref) {
    var _this2 = this;

    var expr = _ref.expr;
    var builder = _ref.builder;
    var selectFilter = _ref.selectFilter;
    var modelClass = _ref.modelClass;
    var relation = _ref.relation;
    var path = _ref.path;
    var parentInfo = _ref.parentInfo;

    var info = this.createPathInfo({
      modelClass: modelClass,
      path: path,
      relation: relation,
      parentInfo: parentInfo
    });

    this.pathInfo[path] = info;

    this.buildSelects({
      builder: builder,
      selectFilter: selectFilter,
      modelClass: modelClass,
      relation: relation,
      info: info
    });

    forEachExpr(expr, modelClass, function (childExpr, relation) {
      var nextPath = _this2.joinPath(path, relation.name);
      var encNextPath = _this2.encode(nextPath);
      var encJoinTablePath = relation.joinTable ? _this2.encode(joinTableForPath(nextPath)) : null;

      var filterQuery = createFilterQuery({
        builder: builder,
        relation: relation,
        expr: childExpr
      });

      var relatedJoinSelectQuery = createRelatedJoinFromQuery({
        filterQuery: filterQuery,
        relation: relation,
        allRelations: _this2.allRelations
      });

      relation.join(builder, {
        joinOperation: 'leftJoin',
        ownerTable: info.encPath,
        relatedTableAlias: encNextPath,
        joinTableAlias: encJoinTablePath,
        relatedJoinSelectQuery: relatedJoinSelectQuery
      });

      // Apply relation.modify since it may also contains selections. Don't move this
      // to the createFilterQuery function because relatedJoinSelectQuery is cloned
      // From the return value of that function and we don't want relation.modify
      // to be called twice for it.
      filterQuery.modify(relation.modify);

      _this2.build({
        expr: childExpr,
        builder: builder,
        modelClass: relation.relatedModelClass,
        relation: relation,
        parentInfo: info,
        path: nextPath,
        selectFilter: function selectFilter(col) {
          return filterQuery.hasSelection(col);
        }
      });
    });
  };

  JoinEagerOperation.prototype.createPathInfo = function createPathInfo(_ref2) {
    var modelClass = _ref2.modelClass;
    var path = _ref2.path;
    var relation = _ref2.relation;
    var parentInfo = _ref2.parentInfo;

    var encPath = this.encode(path);
    var info = void 0;

    if (relation && relation.isOneToOne()) {
      info = new OneToOnePathInfo();
    } else {
      info = new PathInfo();
    }

    info.path = path;
    info.encPath = encPath;
    info.parentPath = parentInfo && parentInfo.path;
    info.encParentPath = parentInfo && parentInfo.encPath;
    info.modelClass = modelClass;
    info.relation = relation;
    info.idGetter = this.createIdGetter(modelClass, encPath);

    if (parentInfo) {
      parentInfo.children[relation.name] = info;
    }

    return info;
  };

  JoinEagerOperation.prototype.buildSelects = function buildSelects(_ref3) {
    var _this3 = this;

    var builder = _ref3.builder;
    var selectFilter = _ref3.selectFilter;
    var modelClass = _ref3.modelClass;
    var relation = _ref3.relation;
    var info = _ref3.info;

    var selects = [];
    var idCols = modelClass.getIdColumnArray();
    var rootTable = this.rootModelClass.tableName;

    columnInfo[modelClass.tableName].columns.forEach(function (col) {
      var filterPassed = selectFilter(col);
      var isIdColumn = idCols.indexOf(col) !== -1;

      if (filterPassed || isIdColumn) {
        selects.push({
          col: (info.encPath || rootTable) + '.' + col,
          alias: _this3.joinPath(info.encPath, col)
        });

        if (!filterPassed) {
          info.omitCols[col] = true;
        }
      }
    });

    if (relation && relation.joinTableExtraCols) {
      (function () {
        var joinTable = _this3.encode(joinTableForPath(info.path));

        relation.joinTableExtraCols.forEach(function (col) {
          if (selectFilter(col)) {
            selects.push({
              col: joinTable + '.' + col,
              alias: _this3.joinPath(info.encPath, col)
            });
          }
        });
      })();
    }

    var tooLongAliases = selects.filter(function (select) {
      return select.alias.length > idLengthLimit;
    });

    if (tooLongAliases.length) {
      throw new _ValidationError2.default({
        eager: 'identifier ' + tooLongAliases[0].alias + ' is over ' + idLengthLimit + ' characters long ' + 'and would be truncated by the database engine.'
      });
    }

    builder.select(selects.map(function (select) {
      return select.col + ' as ' + select.alias;
    }));
  };

  JoinEagerOperation.prototype.encode = function encode(path) {
    var _this4 = this;

    if (!this.opt.minimize) {
      var encPath = this.encodings[path];

      if (!encPath) {
        var parts = path.split(this.sep);

        // Don't encode the root.
        if (!path) {
          encPath = path;
        } else {
          encPath = parts.map(function (part) {
            return _this4.opt.aliases[part] || part;
          }).join(this.sep);
        }

        this.encodings[path] = encPath;
        this.decodings[encPath] = path;
      }

      return encPath;
    } else {
      var _encPath = this.encodings[path];

      if (!_encPath) {
        // Don't encode the root.
        if (!path) {
          _encPath = path;
        } else {
          _encPath = this.nextEncodedPath();
        }

        this.encodings[path] = _encPath;
        this.decodings[_encPath] = path;
      }

      return _encPath;
    }
  };

  JoinEagerOperation.prototype.decode = function decode(path) {
    return this.decodings[path];
  };

  JoinEagerOperation.prototype.nextEncodedPath = function nextEncodedPath() {
    return '_t' + ++this.encIdx;
  };

  JoinEagerOperation.prototype.createIdGetter = function createIdGetter(modelClass, path) {
    var _this5 = this;

    var idCols = modelClass.getIdColumnArray().map(function (col) {
      return _this5.joinPath(path, col);
    });

    if (idCols.length === 1) {
      return createSingleIdGetter(idCols);
    } else if (idCols.length === 2) {
      return createTwoIdGetter(idCols);
    } else if (idCols.length === 3) {
      return createThreeIdGetter(idCols);
    } else {
      return createNIdGetter(idCols);
    }
  };

  JoinEagerOperation.prototype.joinPath = function joinPath(path, nextPart) {
    if (path) {
      return '' + path + this.sep + nextPart;
    } else {
      return nextPart;
    }
  };

  (0, _createClass3.default)(JoinEagerOperation, [{
    key: 'sep',
    get: function get() {
      return this.opt.separator;
    }
  }]);
  return JoinEagerOperation;
}(_EagerOperation3.default);

exports.default = JoinEagerOperation;


function findAllModels(expr, modelClass) {
  var models = [];

  findAllModelsImpl(expr, modelClass, models);

  return _lodash2.default.uniqBy(models, 'tableName');
}

function findAllModelsImpl(expr, modelClass, models) {
  models.push(modelClass);

  forEachExpr(expr, modelClass, function (childExpr, relation) {
    findAllModelsImpl(childExpr, relation.relatedModelClass, models);
  });
}

function findAllRelations(expr, modelClass) {
  var relations = [];

  findAllRelationsImpl(expr, modelClass, relations);

  return _lodash2.default.uniqWith(relations, function (lhs, rhs) {
    return lhs === rhs;
  });
}

function findAllRelationsImpl(expr, modelClass, relations) {
  forEachExpr(expr, modelClass, function (childExpr, relation) {
    relations.push(relation);

    findAllRelationsImpl(childExpr, relation.relatedModelClass, relations);
  });
}

function fetchColumnInfo(builder, models) {
  var knex = builder.knex();

  return _bluebird2.default.all(models.map(function (ModelClass) {
    var table = ModelClass.tableName;

    if (columnInfo[table]) {
      return columnInfo[table];
    } else {
      columnInfo[table] = knex(table).columnInfo().then(function (info) {
        var result = {
          columns: (0, _keys2.default)(info)
        };

        columnInfo[table] = result;
        return result;
      });

      return columnInfo[table];
    }
  }));
}

function forEachExpr(expr, modelClass, callback) {
  var relations = modelClass.getRelations();
  var relNames = (0, _keys2.default)(relations);

  if (expr.isAllRecursive() || expr.maxRecursionDepth() > relationRecursionLimit) {
    throw new _ValidationError2.default({
      eager: 'recursion depth of eager expression ' + expr.toString() + ' too big for JoinEagerAlgorithm'
    });
  }

  for (var i = 0, l = relNames.length; i < l; ++i) {
    var relName = relNames[i];
    var relation = relations[relName];
    var childExpr = expr.childExpression(relation.name);

    if (childExpr) {
      callback(childExpr, relation, relName);
    }
  }
}

function createSingleIdGetter(idCols) {
  var idCol = idCols[0];

  return function (row) {
    var val = row[idCol];

    if (!val) {
      return null;
    } else {
      return val;
    }
  };
}

function createTwoIdGetter(idCols) {
  var idCol1 = idCols[0];
  var idCol2 = idCols[1];

  return function (row) {
    var val1 = row[idCol1];
    var val2 = row[idCol2];

    if (!val1 || !val2) {
      return null;
    } else {
      return val1 + ',' + val2;
    }
  };
}

function createThreeIdGetter(idCols) {
  var idCol1 = idCols[0];
  var idCol2 = idCols[1];
  var idCol3 = idCols[2];

  return function (row) {
    var val1 = row[idCol1];
    var val2 = row[idCol2];
    var val3 = row[idCol3];

    if (!val1 || !val2 || !val3) {
      return null;
    } else {
      return val1 + ',' + val2 + ',' + val3;
    }
  };
}

function createNIdGetter(idCols) {
  return function (row) {
    var id = '';

    for (var i = 0, l = idCols.length; i < l; ++i) {
      var val = row[idCols[i]];

      if (!val) {
        return null;
      }

      id += (i > 0 ? ',' : '') + val;
    }

    return id;
  };
}

function createFilterQuery(_ref4) {
  var builder = _ref4.builder;
  var expr = _ref4.expr;
  var relation = _ref4.relation;

  var filterQuery = relation.relatedModelClass.query().childQueryOf(builder);

  for (var i = 0, l = expr.args.length; i < l; ++i) {
    var filterName = expr.args[i];
    var filter = expr.filters[filterName];

    if (typeof filter !== 'function') {
      throw new _ValidationError2.default({ eager: 'could not find filter "' + filterName + '" for relation "' + relation.name + '"' });
    }

    filter(filterQuery);
  }

  return filterQuery;
}

function createRelatedJoinFromQuery(_ref5) {
  var filterQuery = _ref5.filterQuery;
  var relation = _ref5.relation;
  var allRelations = _ref5.allRelations;

  var relatedJoinFromQuery = filterQuery.clone();

  var allForeignKeys = findAllForeignKeysForModel({
    modelClass: relation.relatedModelClass,
    allRelations: allRelations
  });

  return relatedJoinFromQuery.select(allForeignKeys.filter(function (col) {
    return !relatedJoinFromQuery.hasSelection(col);
  }));
}

function findAllForeignKeysForModel(_ref6) {
  var modelClass = _ref6.modelClass;
  var allRelations = _ref6.allRelations;

  var foreignKeys = modelClass.getIdColumnArray().slice();

  allRelations.forEach(function (rel) {
    if (rel.relatedModelClass.tableName === modelClass.tableName) {
      rel.relatedCol.forEach(function (col) {
        return foreignKeys.push(col);
      });
    }

    if (rel.ownerModelClass.tableName === modelClass.tableName) {
      rel.ownerCol.forEach(function (col) {
        return foreignKeys.push(col);
      });
    }
  });

  return _lodash2.default.uniq(foreignKeys);
}

function createModel(row, pInfo, keyInfoByPath) {
  var keyInfo = keyInfoByPath[pInfo.encPath];
  var json = {};

  for (var k = 0, lk = keyInfo.length; k < lk; ++k) {
    var kInfo = keyInfo[k];
    json[kInfo.col] = row[kInfo.key];
  }

  return pInfo.modelClass.fromDatabaseJson(json);
}

function joinTableForPath(path) {
  return path + '_join';
}

var PathInfo = function () {
  function PathInfo() {
    (0, _classCallCheck3.default)(this, PathInfo);

    this.path = null;
    this.encPath = null;
    this.encParentPath = null;
    this.modelClass = null;
    this.relation = null;
    this.omitCols = (0, _create2.default)(null);
    this.children = (0, _create2.default)(null);
    this.idGetter = null;
  }

  PathInfo.prototype.createBranch = function createBranch(parentModel) {
    var branch = (0, _create2.default)(null);
    parentModel[this.relation.name] = branch;
    return branch;
  };

  PathInfo.prototype.getBranch = function getBranch(parentModel) {
    return parentModel[this.relation.name];
  };

  PathInfo.prototype.getModelFromBranch = function getModelFromBranch(branch, id) {
    return branch[id];
  };

  PathInfo.prototype.setModelToBranch = function setModelToBranch(branch, id, model) {
    branch[id] = model;
  };

  PathInfo.prototype.finalizeBranch = function finalizeBranch(branch, parentModel) {
    var relModels = _lodash2.default.values(branch);
    parentModel[this.relation.name] = relModels;
    return relModels;
  };

  return PathInfo;
}();

var OneToOnePathInfo = function (_PathInfo) {
  (0, _inherits3.default)(OneToOnePathInfo, _PathInfo);

  function OneToOnePathInfo() {
    (0, _classCallCheck3.default)(this, OneToOnePathInfo);
    return (0, _possibleConstructorReturn3.default)(this, _PathInfo.apply(this, arguments));
  }

  OneToOnePathInfo.prototype.createBranch = function createBranch(parentModel) {
    return parentModel;
  };

  OneToOnePathInfo.prototype.getBranch = function getBranch(parentModel) {
    return parentModel;
  };

  OneToOnePathInfo.prototype.getModelFromBranch = function getModelFromBranch(branch, id) {
    return branch[this.relation.name];
  };

  OneToOnePathInfo.prototype.setModelToBranch = function setModelToBranch(branch, id, model) {
    branch[this.relation.name] = model;
  };

  OneToOnePathInfo.prototype.finalizeBranch = function finalizeBranch(branch, parentModel) {
    parentModel[this.relation.name] = branch || null;
    return branch || null;
  };

  return OneToOnePathInfo;
}(PathInfo);