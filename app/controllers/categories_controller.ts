import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
  async index({ view, auth }: HttpContext) {
    await auth.authenticate()
    const user = await auth.getUserOrFail()
    let categories = await Category.all()
    if (user) {
      categories = (await Category.query()).filter((c) => c.createdBy === user.id)
    }
    return view.render('pages/categories/index', { categories: categories })
  }
}
