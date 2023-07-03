import { defu } from 'defu'
import { defineNuxtModule, createResolver, addServerHandler, addImports, addPlugin } from '@nuxt/kit'
import * as csrf from 'uncsrf'
import type { EncryptSecret } from 'uncsrf'

import type { ModuleOptions } from './types'

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-csurf',
    configKey: 'csurf'
  },
  defaults: {
    https: process.env.NODE_ENV === 'production',
    cookieKey: '',
    cookie: {
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    },
    methodsToProtect: ['POST', 'PUT', 'PATCH'],
    excludedUrls: [],
    encryptAlgorithm: csrf.defaultEncryptAlgorithm
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (!options.cookieKey) {
      options.cookieKey = `${options.https ? '__Host-' : ''}csrf`
    }
    options.cookie = options.cookie || {}
    if (options.cookie.secure === undefined) {
      options.cookie.secure = !!options.https
    }

    const secretKey = await csrf.importEncryptSecret(options.encryptSecret, options.encryptAlgorithm)

    nuxt.options.runtimeConfig.csurf = defu(nuxt.options.runtimeConfig.csurf, {
      ...options,
      secretKey
    })
    addServerHandler({ handler: resolve('runtime/server/middleware/csrf') })

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    addImports(['useCsrf', 'useCsrfFetch'].map(key => ({
      name: key,
      as: key,
      from: resolve('runtime/composables')
    })))

    addPlugin(resolve('runtime/plugin'))
  }
})

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    csurf: ModuleOptions & {
      readonly secretKey: EncryptSecret
    }
  }
}
