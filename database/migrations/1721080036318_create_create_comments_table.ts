import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').notNullable().unique()
      table.bigInteger('parent_id').nullable()
      table.text('comment').nullable()
      table.integer('article_id').unsigned().notNullable()
      table.bigInteger('created_by').nullable()
      table.bigInteger('updated_by').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('parent_id').references('comments.id').onDelete('CASCADE')
      table.foreign('article_id').references('articles.id').onDelete('CASCADE')
      table.foreign('created_by').references('users.id').onDelete('SET NULL')
      table.foreign('updated_by').references('users.id').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
