import UpdateOperation from '../../queryBuilder/operations/UpdateOperation';

export default class ManyToManyUpdateSqliteOperation extends UpdateOperation {

  constructor(knex, name, opt) {
    super(knex, name, opt);

    this.relation = opt.relation;
    this.owner = opt.owner;
  }

  onBeforeBuild(builder) {
    super.onBeforeBuild(builder);
    this.relation.selectForModifySqlite(builder, this.owner).modify(this.relation.modify);
  }
}
