/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.get('/index', async (ctx) => {
  ctx.view.share({ test: 'Voici ma page index ' })
  return ctx.view.render('pages/index')
})

router.get('/about', async (ctx) => {
  return ctx.view.render('pages/about')
})

router.get('/contact', async (ctx) => {
  return ctx.view.render('pages/contact')
})

router.get('/users/create', async (ctx) => {
  return ctx.view.render('pages/users/create')
})
