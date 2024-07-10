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

router.get('/about', async (ctx) => {
  return ctx.view.render('pages/about')
})

router.get('/contact', async (ctx) => {
  return ctx.view.render('pages/contact')
})

router.get('/users/create', async (ctx) => {
  return ctx.view.render('pages/users/create')
})

router.post('/users', async ({ request, auth, response }: HttpContext) => {
  const data = request.only(['last_name', 'first_name', 'email', 'password'])
  const user = await User.create(data)
  await auth.use('web').login(user)
  return response.redirect('/index')
})

router.get('/login', async ({ request, auth, view }: HttpContext) => {
  const { email, password } = request.only(['email', 'password'])
  const user = await User.verifyCredentials(email, password)
  await auth.use('web').login(user)
  return view.render('pages/users/login')
})
