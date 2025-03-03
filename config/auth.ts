import { defineConfig } from '@adonisjs/auth'
// import { basicAuthGuard, basicAuthUserProvider } from '@adonisjs/auth/basic_auth'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'

const authConfig = defineConfig({
  // default: 'basicAuth',
  default: 'web',
  guards: {
    // basicAuth: basicAuthGuard({
    //   provider: basicAuthUserProvider({
    //     model: () => import('#models/user')
    //   }),
    // }),
    web: sessionGuard({
      useRememberMeTokens: true,
      rememberMeTokensAge: '2h',
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
// declare module '@adonisjs/auth/types' {
//   interface Authenticators extends InferAuthenticators<typeof authConfig> { }
// }
// declare module '@adonisjs/core/types' {
//   interface EventsList extends InferAuthEvents<Authenticators> { }
// }
