/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import User from '#models/user'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'
import Article from '#models/article'
import Comment from '#models/comment'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

router.on('/').render('pages/home')

router
  .get('/index', async ({ auth, view }: HttpContext) => {
    const user = auth.getUserOrFail()
    view.share({
      test: `Voici ma page index ${user.email}`,
    })
    return view.render('pages/index')
  })
  .use(middleware.auth())
  .as('index')

router
  .get('/about', async (ctx) => {
    return ctx.view.render('pages/about')
  })
  .as('about')

router
  .get('/contact', async (ctx) => {
    return ctx.view.render('pages/contact')
  })
  .as('contact')

router
  .get('/users/create', async (ctx) => {
    return ctx.view.render('pages/users/create')
  })
  .as('users.create')

router
  .post('/users', async ({ request, auth, response }: HttpContext) => {
    const data = request.only(['last_name', 'first_name', 'email', 'password'])
    const user = await User.create(data)
    await auth.use('web').login(user)
    return response.redirect('/index')
  })
  .as('users.store')

router
  .get('/login', async ({ view }: HttpContext) => {
    return view.render('pages/users/login')
  })
  .as('users.login.form')

router
  .post('/login', async ({ request, auth, response }: HttpContext) => {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return response.redirect('/index')
  })
  .as('users.login')

router
  .post('logout', async ({ auth, response }) => {
    await auth.use('web').logout()
    return response.redirect('/login')
  })
  .use(middleware.auth())
  .as('users.logout')

router
  .get('/categories', async ({ view, auth }: HttpContext) => {
    await auth.authenticate()
    const user = await auth.getUserOrFail()
    let categories = await Category.all()
    if (user) {
      categories = (await Category.query()).filter((c) => c.createdBy === user.id)
    }
    return view.render('pages/categories/index', { categories: categories })
  })
  .use(middleware.auth())
  .as('categories.index')

router
  .get('/categories/:id/show', async ({ view, auth, params }: HttpContext) => {
    await auth.authenticate()
    const category = await Category.query()
      .where('id', params.id)
      .preload('articles') // Precharger les articles associés
      .firstOrFail()
    return view.render('pages/categories/show', { category: category })
  })
  .use(middleware.auth())
  .as('categories.show')

router
  .get('/categories/create', async ({ view }: HttpContext) => {
    return view.render('pages/categories/create', { category: null })
  })
  .use(middleware.auth())
  .as('categories.create')

router
  .post('/categories', async ({ auth, request, response }: HttpContext) => {
    await auth.authenticate()
    const user = await auth.getUserOrFail()
    let data = request.only(['slug', 'name'])
    data['createdBy'] = user.id
    await Category.create(data)
    return response.redirect('/categories')
  })
  .use(middleware.auth())
  .as('categories.store')

router
  .get('/categories/:id/edit', async ({ view, params }: HttpContext) => {
    const category = await Category.findOrFail(params.id)
    view.share({
      category: category,
    })
    return view.render('pages/categories/create')
  })
  .use(middleware.auth())
  .as('categories.edit')

router
  .put('/categories/:id/update', async ({ request, response, params }: HttpContext) => {
    await auth.authenticate()
    const user = await auth.getUserOrFail()
    let data = request.only(['slug', 'name'])
    data['updatedBy'] = user.id
    await Category.query().where('id', params.id).update(data)
    return response.redirect('/categories')
  })
  .use(middleware.auth())
  .as('categories.update')

router
  .get('/articles', async ({ view }: HttpContext) => {
    const articles = await Article.query().preload('category')
    view.share({
      articles: articles,
    })
    return view.render('pages/articles/index')
  })
  .use(middleware.auth())
  .as('articles.index')

router
  .get('/articles/:id/show', async ({ view, params, auth }: HttpContext) => {
    await auth.authenticate()
    const article = await Article.query()
      .where('id', params.id)
      .preload('category')
      .preload('comments')
      .firstOrFail()
    view.share({
      article: article,
    })
    return view.render('pages/articles/show')
  })
  .use(middleware.auth())
  .as('articles.show')

router
  .get('/articles/create', async ({ view }: HttpContext) => {
    const categories = await Category.all()
    view.share({
      article: null,
      categories: categories,
    })
    return view.render('pages/articles/create')
  })
  .use(middleware.auth())
  .as('articles.create')

router
  .get('/articles/:id/edit', async ({ view, params, auth }: HttpContext) => {
    await auth.authenticate()
    let categories = await Category.all()
    const article = await Article.findOrFail(params.id)
    view.share({
      categories: categories,
      article: article,
    })
    return view.render('pages/articles/create')
  })
  .use(middleware.auth())
  .as('articles.edit')

router
  .put('/articles/:id/update', async ({ request, response, params, auth }: HttpContext) => {
    await auth.authenticate()
    const user = await auth.getUserOrFail()
    let data = request.only(['title', 'content', 'categoryId'])
    data['updatedBy'] = user.id
    await Article.query().where('id', params.id).update(data)
    return response.redirect('/articles')
  })
  .use(middleware.auth())
  .as('articles.update')

router
  .post('/articles', async ({ auth, request, response }: HttpContext) => {
    await auth.authenticate()
    const user = await auth.getUserOrFail()
    let data = request.only(['title', 'content', 'categoryId'])
    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (image) {
      await image.move(app.makePath('uploads/articles/files'), {
        name: `${cuid()}.${image.extname}`,
      })
      data['image'] = `/uploads/articles/files/${image.fileName}`
    } else {
      // Handle the case where no image is uploaded
      data['image'] = null
    }
    data['createdBy'] = user.id
    data['createdBy'] = user.id
    console.log(data)
    await Article.create(data)
    return response.redirect('/articles')
  })
  .use(middleware.auth())
  .as('articles.store')

router
  .post('/articles/:id/comments', async ({ auth, request, response, params }: HttpContext) => {
    await auth.authenticate()
    const user = await auth.getUserOrFail()
    let data = request.only(['comment', 'parentId'])
    data['articleId'] = params.id
    data['createdBy'] = user.id
    await Comment.create(data)
    return response.redirect(`/articles/${params.id}/show`)
  })
  .use(middleware.auth())
  .as('comments.store')
