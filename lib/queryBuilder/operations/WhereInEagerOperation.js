'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ValidationError = require('../../ValidationError');

var _ValidationError2 = _interopRequireDefault(_ValidationError);

var _EagerOperation2 = require('./EagerOperation');

var _EagerOperation3 = _interopRequireDefault(_EagerOperation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WhereInEagerOperation = function (_EagerOperation) {
  (0, _inherits3.default)(WhereInEagerOperation, _EagerOperation);

  function WhereInEagerOperation() {
    (0, _classCallCheck3.default)(this, WhereInEagerOperation);
    return (0, _possibleConstructorReturn3.default)(this, _EagerOperation.apply(this, arguments));
  }

  WhereInEagerOperation.prototype.onAfterInternal = function onAfterInternal(builder, result) {
    var models = Array.isArray(result) ? result : [result];

    if (!models.length || !(models[0] instanceof builder.modelClass())) {
      return result;
    }

    var promises = [];

    this.expression.forEachChild(function (child) {
      var relation = builder.modelClass().getRelations()[child.name];

      if (!relation) {
        throw new _ValidationError2.default({ eager: 'unknown relation "' + child.name + '" in an eager expression' });
      }
    });

    var relations = builder.modelClass().getRelations();
    var relNames = (0, _keys2.default)(relations);

    for (var i = 0, l = relNames.length; i < l; ++i) {
      var relName = relNames[i];
      var relation = relations[relName];

      var childExpression = this.expression.childExpression(relation.name);

      if (childExpression) {
        promises.push(this._fetchRelation(builder, models, relation, childExpression));
      }
    }

    return _bluebird2.default.all(promises).return(result);
  };

  WhereInEagerOperation.prototype._fetchRelation = function _fetchRelation(builder, models, relation, childExpression) {
    var queryBuilder = relation.ownerModelClass.RelatedQueryBuilder.forClass(relation.relatedModelClass).childQueryOf(builder).eager(childExpression);

    queryBuilder.callQueryBuilderOperation(relation.find(queryBuilder, models), []);

    for (var i = 0, l = childExpression.args.length; i < l; ++i) {
      var filterName = childExpression.args[i];
      var filter = childExpression.filters[filterName];

      if (typeof filter !== 'function') {
        throw new _ValidationError2.default({ eager: 'could not find filter "' + filterName + '" for relation "' + relation.name + '"' });
      }

      filter(queryBuilder);
    }

    return queryBuilder;
  };

  return WhereInEagerOperation;
}(_EagerOperation3.default);

exports.default = WhereInEagerOperation;