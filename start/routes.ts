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
  .get('/categories', async ({ view }: HttpContext) => {
    const categories = await Category.all()
    return view.render('pages/categories/index', { categories: categories })
  })
  .as('categories.index')

router
  .get('/categories/create', async (ctx) => {
    return ctx.view.render('pages/categories/create')
  })
  .as('categories.create')

router
  .post('/categories', async ({ request, response }: HttpContext) => {
    let data = request.only(['slug', 'name'])
    await Category.create(data)
    return response.redirect('/index')
  })
  .as('categories.store')
