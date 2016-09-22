'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _FindOperation2 = require('../queryBuilder/operations/FindOperation');

var _FindOperation3 = _interopRequireDefault(_FindOperation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RelationFindOperation = function (_FindOperation) {
  (0, _inherits3.default)(RelationFindOperation, _FindOperation);

  function RelationFindOperation(knex, name, opt) {
    (0, _classCallCheck3.default)(this, RelationFindOperation);

    var _this = (0, _possibleConstructorReturn3.default)(this, _FindOperation.call(this, knex, name, opt));

    _this.relation = opt.relation;
    _this.owners = opt.owners;
    return _this;
  }

  RelationFindOperation.prototype.onBeforeBuild = function onBeforeBuild(builder) {
    var ids = new Array(this.owners.length);

    for (var i = 0, l = this.owners.length; i < l; ++i) {
      ids[i] = this.owners[i].$values(this.relation.ownerProp);
    }

    this.relation.findQuery(builder, {
      ownerIds: _lodash2.default.uniqBy(ids, join)
    });
  };

  RelationFindOperation.prototype.onAfterInternal = function onAfterInternal(builder, related) {
    this.relation.createRelationProp(this.owners, related);

    return related;
  };

  return RelationFindOperation;
}(_FindOperation3.default);

exports.default = RelationFindOperation;


function join(arr) {
  return arr.join();
}