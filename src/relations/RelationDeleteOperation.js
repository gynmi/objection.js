import DeleteOperation from '../queryBuilder/operations/DeleteOperation';

export default class RelationDeleteOperation extends DeleteOperation {

  constructor(knex, name, opt) {
    super(knex, name, opt);

    this.relation = opt.relation;
    this.owner = opt.owner;
  }

  onBeforeBuild(builder) {
    super.onBeforeBuild(builder);

    this.relation.findQuery(builder, [this.owner.$values(this.relation.ownerProp)]);
  }
}