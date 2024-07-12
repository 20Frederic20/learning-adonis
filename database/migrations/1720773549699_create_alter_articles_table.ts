import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('created_by').references('users.id').onDelete('SET NULL')
      table.foreign('updated_by').references('users.id').onDelete('SET NULL')
      table.integer('category_id').unsigned().notNullable()
      table.foreign('category_id').references('categories.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('created_by')
      table.dropForeign('updated_by')
      table.dropForeign('category_id')
      table.dropColumn('category_id')
    })
  }
}
