import { DateTime } from 'luxon'
import User from '#models/user'
import { randomUUID } from 'node:crypto'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Article from './article.js'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare slug: string

  @column()
  declare name: string

  // @belongsTo(() => User)
  // declare createdBy: BelongsTo<typeof User>

  // @belongsTo(() => User)
  // declare updatedBy: BelongsTo<typeof User>

  @column({ columnName: 'created_by' })
  declare createdBy: number

  @column({ columnName: 'updated_by' })
  declare updatedBy: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(category: Category) {
    category.uuid = randomUUID()
  }

  @hasMany(() => Article)
  declare articles: HasMany<typeof Article>
}
