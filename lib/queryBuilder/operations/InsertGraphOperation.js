'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _DelegateOperation2 = require('./DelegateOperation');

var _DelegateOperation3 = _interopRequireDefault(_DelegateOperation2);

var _GraphInserter = require('../graphInserter/GraphInserter');

var _GraphInserter2 = _interopRequireDefault(_GraphInserter);

var _dbUtils = require('../../utils/dbUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InsertGraphOperation = function (_DelegateOperation) {
  (0, _inherits3.default)(InsertGraphOperation, _DelegateOperation);

  function InsertGraphOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, InsertGraphOperation);

    // Our delegate method inherits from `InsertRelation`. Disable the call-time
    // validation. We do the validation in onAfterQuery instead.
    var _this = (0, _possibleConstructorReturn3.default)(this, _DelegateOperation.call(this, knex, name, opt));

    _this.delegate.modelOptions.skipValidation = true;
    return _this;
  }

  InsertGraphOperation.prototype.call = function call(builder, args) {
    var retVal = _DelegateOperation.prototype.call.call(this, builder, args);

    // We resolve this query here and will not execute it. This is because the root
    // value may depend on other models in the graph and cannot be inserted first.
    builder.resolve([]);

    return retVal;
  };

  InsertGraphOperation.prototype.onBefore = function onBefore() {
    // Do nothing.
  };

  InsertGraphOperation.prototype.onBeforeInternal = function onBeforeInternal() {
    // Do nothing. We override this with empty implementation so that
    // the $beforeInsert() hooks are not called twice for the root models.
  };

  InsertGraphOperation.prototype.onBeforeBuild = function onBeforeBuild() {
    // Do nothing.
  };

  InsertGraphOperation.prototype.onBuild = function onBuild() {}
  // Do nothing.


  // We overrode all other hooks but this one and do all the work in here.
  // This is a bit hacky.
  ;

  InsertGraphOperation.prototype.onAfterQuery = function onAfterQuery(builder) {
    var _this2 = this;

    var ModelClass = builder.modelClass();
    var batchSize = (0, _dbUtils.isPostgres)(ModelClass.knex()) ? 100 : 1;

    var inserter = new _GraphInserter2.default({
      modelClass: ModelClass,
      models: this.models,
      allowedRelations: builder._allowedInsertExpression || null
    });

    return inserter.execute(function (tableInsertion) {
      var inputs = [];
      var others = [];
      var queries = [];

      var insertQuery = tableInsertion.modelClass.query().childQueryOf(builder);

      for (var i = 0, l = tableInsertion.models.length; i < l; ++i) {
        var model = tableInsertion.models[i];

        // We skipped the validation above. We need to validate here since at this point
        // the models should no longer contain any special properties.
        model.$validate();

        if (tableInsertion.isInputModel[i]) {
          inputs.push(model);
        } else {
          others.push(model);
        }
      }

      batchInsert(inputs, insertQuery.clone().copyFrom(builder, /returning/), batchSize, queries);
      batchInsert(others, insertQuery.clone(), batchSize, queries);

      return _bluebird2.default.all(queries);
    }).then(function () {
      return _DelegateOperation.prototype.onAfterQuery.call(_this2, builder, _this2.models);
    });
  };

  InsertGraphOperation.prototype.onAfterInternal = function onAfterInternal() {
    // We override this with empty implementation so that the $afterInsert() hooks
    // are not called twice for the root models.
    return this.isArray ? this.models : this.models[0] || null;
  };

  (0, _createClass3.default)(InsertGraphOperation, [{
    key: 'models',
    get: function get() {
      return this.delegate.models;
    }
  }, {
    key: 'isArray',
    get: function get() {
      return this.delegate.isArray;
    }
  }]);
  return InsertGraphOperation;
}(_DelegateOperation3.default);

exports.default = InsertGraphOperation;


function batchInsert(models, queryBuilder, batchSize, queries) {
  var batches = _lodash2.default.chunk(models, batchSize);

  for (var i = 0, l = batches.length; i < l; ++i) {
    queries.push(queryBuilder.clone().insert(batches[i]));
  }
}