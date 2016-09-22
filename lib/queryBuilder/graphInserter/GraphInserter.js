'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _DependencyGraph = require('./DependencyGraph');

var _DependencyGraph2 = _interopRequireDefault(_DependencyGraph);

var _TableInsertion = require('./TableInsertion');

var _TableInsertion2 = _interopRequireDefault(_TableInsertion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GraphInserter = function () {
  function GraphInserter(_ref) {
    var modelClass = _ref.modelClass;
    var models = _ref.models;
    var allowedRelations = _ref.allowedRelations;
    (0, _classCallCheck3.default)(this, GraphInserter);

    /**
     * @type {Constructor.<Model>}
     */
    this.modelClass = modelClass;

    /**
     * @type {Model|Array.<Model>}
     */
    this.models = models;

    /**
     * @type {RelationExpression}
     */
    this.allowedRelations = allowedRelations || null;

    /**
     * @type {boolean}
     */
    this.done = false;

    /**
     * @type {DependencyGraph}
     */
    this.graph = this._buildDependencyGraph();
  }

  /**
   * @param {function(TableInsertion)} inserter
   * @return {Promise}
   */


  GraphInserter.prototype.execute = function execute(inserter) {
    return this._executeNextBatch(inserter);
  };

  /**
   * @returns {DependencyGraph}
   * @private
   */


  GraphInserter.prototype._buildDependencyGraph = function _buildDependencyGraph() {
    var graph = new _DependencyGraph2.default(this.allowedRelations);
    graph.build(this.modelClass, this.models);
    return graph;
  };

  /**
   * @param {function(TableInsertion)} inserter
   * @returns {Promise}
   * @private
   */


  GraphInserter.prototype._executeNextBatch = function _executeNextBatch(inserter) {
    var _this = this;

    var batch = this._nextBatch();

    if (!batch) {
      // If we get here, we are done. All we need to do now is to finalize the object graph
      // and return it as the final output.
      return this._finalize();
    }

    // Insert the batch using the `inserter` function.
    return _bluebird2.default.all((0, _keys2.default)(batch).map(function (tableName) {
      var tableInsertion = batch[tableName];
      var uids = void 0;

      if (!tableInsertion.isJoinTableInsertion) {
        // We need to omit the uid properties so that they don't get inserted
        // into the database. Join table insertions never have uids.
        uids = _this._omitUids(tableInsertion);
      }

      return inserter(tableInsertion).then(function () {
        if (!tableInsertion.isJoinTableInsertion) {
          // Resolve dependencies to the inserted objects. Join table insertions
          // never resolve any dependencies.
          _this._resolveDepsForInsertion(tableInsertion, uids);
        }
      });
    })).then(function () {
      return _this._executeNextBatch(inserter);
    });
  };

  /**
   * @private
   * @returns {Object.<string, TableInsertion>}
   */


  GraphInserter.prototype._nextBatch = function _nextBatch() {
    if (this.done) {
      return null;
    }

    var batch = this._createBatch();

    if (_lodash2.default.isEmpty(batch)) {
      this.done = true;
      return this._createManyToManyRelationJoinRowBatch();
    } else {
      this._markBatchHandled(batch);
      return batch;
    }
  };

  /**
   * @private
   * @returns {Object.<string, TableInsertion>}
   */


  GraphInserter.prototype._createBatch = function _createBatch() {
    var batch = (0, _create2.default)(null);
    var nodes = this.graph.nodes;

    for (var n = 0, ln = nodes.length; n < ln; ++n) {
      var node = nodes[n];

      if (!node.handled && node.needs.length === node.numHandledNeeds) {
        var tableInsertion = batch[node.modelClass.tableName];

        if (!tableInsertion) {
          tableInsertion = new _TableInsertion2.default(node.modelClass, false);
          batch[node.modelClass.tableName] = tableInsertion;
        }

        tableInsertion.models.push(node.model);
        tableInsertion.isInputModel.push(!!this.graph.inputNodesById[node.id]);
      }
    }

    return batch;
  };

  /**
   * @private
   * @param {Object.<string, TableInsertion>} batch
   */


  GraphInserter.prototype._markBatchHandled = function _markBatchHandled(batch) {
    var models = _lodash2.default.flatten(_lodash2.default.map(batch, 'models'));
    var nodes = this.graph.nodesById;

    for (var m = 0, lm = models.length; m < lm; ++m) {
      var id = models[m][models[m].constructor.uidProp];
      var node = nodes[id];

      for (var nb = 0, lnb = node.isNeededBy.length; nb < lnb; ++nb) {
        var dep = node.isNeededBy[nb];
        dep.node.numHandledNeeds++;
      }

      node.handled = true;
    }
  };

  /**
   * @private
   * @returns {Object.<string, TableInsertion>}
   */


  GraphInserter.prototype._createManyToManyRelationJoinRowBatch = function _createManyToManyRelationJoinRowBatch() {
    var batch = (0, _create2.default)(null);

    for (var n = 0, ln = this.graph.nodes.length; n < ln; ++n) {
      var node = this.graph.nodes[n];

      for (var m = 0, lm = node.manyToManyConnections.length; m < lm; ++m) {
        var conn = node.manyToManyConnections[m];
        var tableInsertion = batch[conn.relation.joinTable];

        var ownerProp = node.model.$values(conn.relation.ownerProp);
        var modelClass = conn.relation.joinTableModelClass;
        var joinModel = conn.relation.createJoinModels(ownerProp, [conn.node.model])[0];

        if (conn.refNode) {
          // Also take extra properties from the referring model, it there was one.
          for (var k = 0, lk = conn.relation.joinTableExtraProps.length; k < lk; ++k) {
            var extraProp = conn.relation.joinTableExtraProps[k];

            if (!_lodash2.default.isUndefined(conn.refNode.model[extraProp])) {
              joinModel[extraProp] = conn.refNode.model[extraProp];
            }
          }
        }

        joinModel = modelClass.fromJson(joinModel);

        if (!tableInsertion) {
          tableInsertion = new _TableInsertion2.default(modelClass, true);
          batch[modelClass.tableName] = tableInsertion;
        }

        tableInsertion.models.push(joinModel);
        tableInsertion.isInputModel.push(false);
      }
    }

    var modelNames = (0, _keys2.default)(batch);
    // Remove duplicates.
    for (var i = 0, l = modelNames.length; i < l; ++i) {
      var modelName = modelNames[i];
      var _tableInsertion = batch[modelName];

      if (_tableInsertion.models.length) {
        (function () {
          var keys = _lodash2.default.keys(_tableInsertion.models[0]);

          _tableInsertion.models = _lodash2.default.uniqBy(_tableInsertion.models, function (model) {
            return model.$propKey(keys);
          });
          _tableInsertion.isInputModel = _lodash2.default.times(_tableInsertion.models.length, _lodash2.default.constant(false));
        })();
      }
    }

    return batch;
  };

  /**
   * @private
   */


  GraphInserter.prototype._omitUids = function _omitUids(tableInsertion) {
    var ids = _lodash2.default.map(tableInsertion.models, tableInsertion.modelClass.uidProp);

    for (var m = 0, lm = tableInsertion.models.length; m < lm; ++m) {
      tableInsertion.models[m].$omit(tableInsertion.modelClass.uidProp);
    }

    return ids;
  };

  /**
   * @private
   * @param {TableInsertion} tableInsertion
   * @param {Array.<string>} uids
   */


  GraphInserter.prototype._resolveDepsForInsertion = function _resolveDepsForInsertion(tableInsertion, uids) {
    for (var m = 0, lm = tableInsertion.models.length; m < lm; ++m) {
      var node = this.graph.nodesById[uids[m]];
      var model = tableInsertion.models[m];

      for (var d = 0, ld = node.isNeededBy.length; d < ld; ++d) {
        node.isNeededBy[d].resolve(model);
      }
    }
  };

  /**
   * @private
   * @return {Promise}
   */


  GraphInserter.prototype._finalize = function _finalize() {
    for (var n = 0, ln = this.graph.nodes.length; n < ln; ++n) {
      var refNode = this.graph.nodes[n];
      var ref = refNode.model[refNode.modelClass.uidRefProp];

      if (ref) {
        // Copy all the properties to the reference nodes.
        var actualNode = this.graph.nodesById[ref];
        var relations = actualNode.modelClass.getRelations();
        var keys = (0, _keys2.default)(actualNode.model);

        for (var i = 0, l = keys.length; i < l; ++i) {
          var key = keys[i];
          var value = actualNode.model[key];

          if (!relations[key] && !_lodash2.default.isFunction(value)) {
            refNode.model[key] = value;
          }
        }

        refNode.model.$omit(refNode.modelClass.uidProp, refNode.modelClass.uidRefProp);
      }
    }

    return _bluebird2.default.resolve(this.models);
  };

  return GraphInserter;
}();

exports.default = GraphInserter;