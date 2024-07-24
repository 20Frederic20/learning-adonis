import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import Article from './article.js'
import { randomUUID } from 'node:crypto'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare uuid: string

  @column({ columnName: 'article_id' })
  declare articleId: number

  @column({ columnName: 'parent_id' })
  declare parentId: number

  @column()
  declare comment: string

  @column({ columnName: 'created_by' })
  declare createdBy: number

  @column({ columnName: 'updated_by' })
  declare updatedBy: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Article)
  declare article: BelongsTo<typeof Article>

  @beforeCreate()
  static assignUuid(comment: Comment) {
    comment.uuid = randomUUID()
  }
}
