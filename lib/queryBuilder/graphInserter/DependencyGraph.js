'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _Model = require('../../model/Model');

var _Model2 = _interopRequireDefault(_Model);

var _HasManyRelation = require('../../relations/hasMany/HasManyRelation');

var _HasManyRelation2 = _interopRequireDefault(_HasManyRelation);

var _RelationExpression = require('../RelationExpression');

var _RelationExpression2 = _interopRequireDefault(_RelationExpression);

var _ManyToManyRelation = require('../../relations/manyToMany/ManyToManyRelation');

var _ManyToManyRelation2 = _interopRequireDefault(_ManyToManyRelation);

var _BelongsToOneRelation = require('../../relations/belongsToOne/BelongsToOneRelation');

var _BelongsToOneRelation2 = _interopRequireDefault(_BelongsToOneRelation);

var _ValidationError = require('../../ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _DependencyNode = require('./DependencyNode');

var _DependencyNode2 = _interopRequireDefault(_DependencyNode);

var _HasManyDependency = require('./HasManyDependency');

var _HasManyDependency2 = _interopRequireDefault(_HasManyDependency);

var _ManyToManyConnection = require('./ManyToManyConnection');

var _ManyToManyConnection2 = _interopRequireDefault(_ManyToManyConnection);

var _ReplaceValueDependency = require('./ReplaceValueDependency');

var _ReplaceValueDependency2 = _interopRequireDefault(_ReplaceValueDependency);

var _BelongsToOneDependency = require('./BelongsToOneDependency');

var _BelongsToOneDependency2 = _interopRequireDefault(_BelongsToOneDependency);

var _InterpolateValueDependency = require('./InterpolateValueDependency');

var _InterpolateValueDependency2 = _interopRequireDefault(_InterpolateValueDependency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DependencyGraph = function () {
  function DependencyGraph(allowedRelations) {
    (0, _classCallCheck3.default)(this, DependencyGraph);

    /**
     * @type {RelationExpression}
     */
    this.allowedRelations = allowedRelations;

    /**
     * @type {Object.<string, DependencyNode>}
     */
    this.nodesById = (0, _create2.default)(null);

    /**
     * @type {Object.<string, DependencyNode>}
     */
    this.inputNodesById = (0, _create2.default)(null);

    /**
     * @type {Array.<DependencyNode>}
     */
    this.nodes = [];

    /**
     * @type {number}
     */
    this.uid = 0;
  }

  DependencyGraph.prototype.build = function build(modelClass, models) {
    this.nodesById = (0, _create2.default)(null);
    this.nodes = [];

    if (Array.isArray(models)) {
      for (var i = 0, l = models.length; i < l; ++i) {
        this.buildForModel(modelClass, models[i], null, null, this.allowedRelations);
      }
    } else {
      this.buildForModel(modelClass, models, null, null, this.allowedRelations);
    }

    this.solveReferences();
    this.createNonRelationDeps();

    if (this.isCyclic(this.nodes)) {
      throw new _ValidationError2.default({ cyclic: 'the object graph contains cyclic references' });
    }

    return this.nodes;
  };

  DependencyGraph.prototype.buildForModel = function buildForModel(modelClass, model, parentNode, rel, allowedRelations) {
    if (!(model instanceof _Model2.default)) {
      throw new _ValidationError2.default({ notModel: 'not a model' });
    }

    if (!model[model.constructor.uidProp]) {
      model[model.constructor.uidProp] = this.createUid();
    }

    var node = new _DependencyNode2.default(model, modelClass);

    this.nodesById[node.id] = node;
    this.nodes.push(node);

    if (!parentNode) {
      this.inputNodesById[node.id] = node;
    }

    if (rel instanceof _HasManyRelation2.default) {

      node.needs.push(new _HasManyDependency2.default(parentNode, rel));
      parentNode.isNeededBy.push(new _HasManyDependency2.default(node, rel));
    } else if (rel instanceof _BelongsToOneRelation2.default) {

      node.isNeededBy.push(new _BelongsToOneDependency2.default(parentNode, rel));
      parentNode.needs.push(new _BelongsToOneDependency2.default(node, rel));
    } else if (rel instanceof _ManyToManyRelation2.default) {

      // ManyToManyRelations create no dependencies since we can create the
      // join table rows after everything else has been inserted.
      parentNode.manyToManyConnections.push(new _ManyToManyConnection2.default(node, rel));
    }

    this.buildForRelations(modelClass, model, node, allowedRelations);
  };

  DependencyGraph.prototype.buildForRelations = function buildForRelations(modelClass, model, node, allowedRelations) {
    var relations = modelClass.getRelations();
    var relNames = (0, _keys2.default)(relations);

    for (var i = 0, l = relNames.length; i < l; ++i) {
      var relName = relNames[i];
      var relModels = model[relName];
      var rel = relations[relName];

      var nextAllowed = null;

      if (relModels && allowedRelations instanceof _RelationExpression2.default) {
        nextAllowed = allowedRelations.childExpression(relName);

        if (!nextAllowed) {
          throw new _ValidationError2.default({ allowedRelations: 'trying to insert an unallowed relation' });
        }
      }

      if (Array.isArray(relModels)) {
        for (var _i = 0, _l = relModels.length; _i < _l; ++_i) {
          this.buildForItem(rel.relatedModelClass, relModels[_i], node, rel, nextAllowed);
        }
      } else if (relModels) {
        this.buildForItem(rel.relatedModelClass, relModels, node, rel, nextAllowed);
      }
    }
  };

  DependencyGraph.prototype.buildForItem = function buildForItem(modelClass, item, parentNode, rel, allowedRelations) {
    if (rel instanceof _ManyToManyRelation2.default && item[modelClass.dbRefProp]) {
      this.buildForId(modelClass, item, parentNode, rel, allowedRelations);
    } else {
      this.buildForModel(modelClass, item, parentNode, rel, allowedRelations);
    }
  };

  DependencyGraph.prototype.buildForId = function buildForId(modelClass, item, parentNode, rel) {
    var node = new _DependencyNode2.default(item, modelClass);
    node.handled = true;

    item.$id(item[modelClass.dbRefProp]);
    parentNode.manyToManyConnections.push(new _ManyToManyConnection2.default(node, rel));
  };

  DependencyGraph.prototype.solveReferences = function solveReferences() {
    var refMap = (0, _create2.default)(null);

    // First merge all reference nodes into the actual node.
    this.mergeReferences(refMap);

    // Replace all reference nodes with the actual nodes.
    this.replaceReferenceNodes(refMap);
  };

  DependencyGraph.prototype.mergeReferences = function mergeReferences(refMap) {
    for (var n = 0, ln = this.nodes.length; n < ln; ++n) {
      var refNode = this.nodes[n];

      if (refNode.handled) {
        continue;
      }

      var ref = refNode.model[refNode.modelClass.uidRefProp];

      if (ref) {
        var actualNode = this.nodesById[ref];

        if (!actualNode) {
          throw new _ValidationError2.default({ ref: 'could not resolve reference "' + ref + '"' });
        }

        var d = void 0,
            ld = void 0;

        for (d = 0, ld = refNode.needs.length; d < ld; ++d) {
          actualNode.needs.push(refNode.needs[d]);
        }

        for (d = 0, ld = refNode.isNeededBy.length; d < ld; ++d) {
          actualNode.isNeededBy.push(refNode.isNeededBy[d]);
        }

        for (var m = 0, lm = refNode.manyToManyConnections.length; m < lm; ++m) {
          actualNode.manyToManyConnections.push(refNode.manyToManyConnections[m]);
        }

        refMap[refNode.id] = actualNode;
        refNode.handled = true;
      }
    }
  };

  DependencyGraph.prototype.replaceReferenceNodes = function replaceReferenceNodes(refMap) {
    for (var n = 0, ln = this.nodes.length; n < ln; ++n) {
      var node = this.nodes[n];
      var d = void 0,
          ld = void 0,
          dep = void 0,
          actualNode = void 0;

      for (d = 0, ld = node.needs.length; d < ld; ++d) {
        dep = node.needs[d];
        actualNode = refMap[dep.node.id];

        if (actualNode) {
          dep.node = actualNode;
        }
      }

      for (d = 0, ld = node.isNeededBy.length; d < ld; ++d) {
        dep = node.isNeededBy[d];
        actualNode = refMap[dep.node.id];

        if (actualNode) {
          dep.node = actualNode;
        }
      }

      for (var m = 0, lm = node.manyToManyConnections.length; m < lm; ++m) {
        var conn = node.manyToManyConnections[m];
        actualNode = refMap[conn.node.id];

        if (actualNode) {
          conn.refNode = conn.node;
          conn.node = actualNode;
        }
      }
    }
  };

  DependencyGraph.prototype.createNonRelationDeps = function createNonRelationDeps() {
    for (var n = 0, ln = this.nodes.length; n < ln; ++n) {
      var node = this.nodes[n];

      if (!node.handled) {
        this.createNonRelationDepsForObject(node.model, node, []);
      }
    }
  };

  DependencyGraph.prototype.createNonRelationDepsForObject = function createNonRelationDepsForObject(obj, node, path) {
    var _this = this;

    var propRefRegex = node.modelClass.propRefRegex;
    var relations = node.modelClass.getRelations();
    var isModel = obj instanceof _Model2.default;
    var keys = (0, _keys2.default)(obj);

    var _loop = function _loop(i, l) {
      var key = keys[i];
      var value = obj[key];

      if (isModel && relations[key]) {
        // Don't traverse the relations of model instances.
        return {
          v: void 0
        };
      }

      path.push(key);

      if (typeof value === 'string') {
        allMatches(propRefRegex, value, function (matchResult) {
          var match = matchResult[0];
          var refId = matchResult[1];
          var refProp = matchResult[2];
          var refNode = _this.nodesById[refId];

          if (!refNode) {
            throw new _ValidationError2.default({ ref: 'could not resolve reference "' + value + '"' });
          }

          if (value === match) {
            // If the match is the whole string, replace the value with the resolved value.
            // This means that the value will have the same type as the resolved value
            // (date, number, etc).
            node.needs.push(new _ReplaceValueDependency2.default(refNode, path, refProp, false));
            refNode.isNeededBy.push(new _ReplaceValueDependency2.default(node, path, refProp, true));
          } else {
            // If the match is inside a string, replace the reference inside the string with
            // the resolved value.
            node.needs.push(new _InterpolateValueDependency2.default(refNode, path, refProp, match, false));
            refNode.isNeededBy.push(new _InterpolateValueDependency2.default(node, path, refProp, match, true));
          }
        });
      } else if (value && (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
        _this.createNonRelationDepsForObject(value, node, path);
      }

      path.pop();
    };

    for (var i = 0, l = keys.length; i < l; ++i) {
      var _ret = _loop(i, l);

      if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
    }
  };

  DependencyGraph.prototype.isCyclic = function isCyclic(nodes) {
    var isCyclic = false;

    for (var n = 0, ln = nodes.length; n < ln; ++n) {
      var node = nodes[n];

      if (node.handled) {
        return;
      }

      if (this.isCyclicNode(node)) {
        isCyclic = true;
        break;
      }
    }

    this.clearFlags(this.nodes);
    return isCyclic;
  };

  DependencyGraph.prototype.isCyclicNode = function isCyclicNode(node) {
    if (!node.visited) {
      node.visited = true;
      node.recursion = true;

      for (var d = 0, ld = node.needs.length; d < ld; ++d) {
        var dep = node.needs[d];

        if (!dep.node.visited && this.isCyclicNode(dep.node)) {
          return true;
        } else if (dep.node.recursion) {
          return true;
        }
      }
    }

    node.recursion = false;
    return false;
  };

  DependencyGraph.prototype.clearFlags = function clearFlags(nodes) {
    for (var n = 0, ln = nodes.length; n < ln; ++n) {
      var node = nodes[n];

      node.visited = false;
      node.recursion = false;
    }
  };

  DependencyGraph.prototype.createUid = function createUid() {
    return '__objection_uid(' + ++this.uid + ')__';
  };

  return DependencyGraph;
}();

exports.default = DependencyGraph;


function allMatches(regex, str, cb) {
  var matchResult = regex.exec(str);

  while (matchResult) {
    cb(matchResult);
    matchResult = regex.exec(str);
  }
}