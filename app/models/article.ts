import { DateTime } from 'luxon'
// import User from '#models/user'
import { randomUUID } from 'node:crypto'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, beforeCreate, hasMany } from '@adonisjs/lucid/orm'
import Category from './category.js'
import Comment from './comment.js'
import User from './user.js'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare categoryId: number

  @column({ columnName: 'created_by' })
  declare createdBy: number

  @column()
  declare image: string

  @column({ columnName: 'updated_by' })
  declare updatedBy: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare author: BelongsTo<typeof User>

  @beforeCreate()
  static assignUuid(article: Article) {
    article.uuid = randomUUID()
  }

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>
}
