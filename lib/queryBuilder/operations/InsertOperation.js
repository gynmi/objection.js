'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _QueryBuilderOperation = require('./QueryBuilderOperation');

var _QueryBuilderOperation2 = _interopRequireDefault(_QueryBuilderOperation);

var _promiseUtils = require('../../utils/promiseUtils');

var _dbUtils = require('../../utils/dbUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InsertOperation = function (_QueryBuilderOperatio) {
  (0, _inherits3.default)(InsertOperation, _QueryBuilderOperatio);

  function InsertOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, InsertOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _QueryBuilderOperatio.call(this, knex, name, opt));

    _this.models = null;
    _this.isArray = false;
    _this.modelOptions = (0, _clone2.default)(_this.opt.modelOptions) || {};
    _this.isWriteOperation = true;
    return _this;
  }

  InsertOperation.prototype.call = function call(builder, args) {
    this.isArray = Array.isArray(args[0]);
    this.models = builder.modelClass().ensureModelArray(args[0], this.modelOptions);
    return true;
  };

  InsertOperation.prototype.onBeforeInternal = function onBeforeInternal(builder, result) {
    if (this.models.length > 1 && !(0, _dbUtils.isPostgres)(this.knex)) {
      throw new Error('batch insert only works with Postgresql');
    } else {
      return (0, _promiseUtils.mapAfterAllReturn)(this.models, function (model) {
        return model.$beforeInsert(builder.context());
      }, result);
    }
  };

  InsertOperation.prototype.onBuild = function onBuild(knexBuilder, builder) {
    if (!builder.has(/returning/)) {
      // If the user hasn't specified a `returning` clause, we make sure
      // that at least the identifier is returned.
      knexBuilder.returning(builder.modelClass().idColumn);
    }

    var json = new Array(this.models.length);

    for (var i = 0, l = this.models.length; i < l; ++i) {
      json[i] = this.models[i].$toDatabaseJson();
    }

    knexBuilder.insert(json);
  };

  InsertOperation.prototype.onAfterQuery = function onAfterQuery(builder, ret) {
    if (!Array.isArray(ret) || !ret.length || ret === this.models) {
      // Early exit if there is nothing to do.
      return this.models;
    }

    if (ret[0] && (0, _typeof3.default)(ret[0]) === 'object') {
      // If the user specified a `returning` clause the result may be an array of objects.
      // Merge all values of the objects to our models.
      for (var i = 0, l = this.models.length; i < l; ++i) {
        this.models[i].$set(ret[i]);
      }
    } else {
      // If the return value is not an array of objects, we assume it is an array of identifiers.
      for (var _i = 0, _l = this.models.length; _i < _l; ++_i) {
        var model = this.models[_i];

        // Don't set the id if the model already has one. MySQL and Sqlite don't return the correct
        // primary key value if the id is not generated in db, but given explicitly.
        if (!model.$id()) {
          model.$id(ret[_i]);
        }
      }
    }

    return this.models;
  };

  InsertOperation.prototype.onAfterInternal = function onAfterInternal(builder, models) {
    var result = this.isArray ? models : models[0] || null;
    return (0, _promiseUtils.mapAfterAllReturn)(models, function (model) {
      return model.$afterInsert(builder.context());
    }, result);
  };

  return InsertOperation;
}(_QueryBuilderOperation2.default);

exports.default = InsertOperation;