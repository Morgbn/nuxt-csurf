import { randomBytes } from 'crypto'
import { defu } from 'defu'
import { defineNuxtModule, createResolver, addServerHandler, addImports } from '@nuxt/kit'
import { RuntimeConfig } from '@nuxt/schema'

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
    encryptSecret: randomBytes(22).toString('base64'),
    encryptAlgorithm: 'aes-256-cbc'
  },
  setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (!options.cookieKey) {
      options.cookieKey = `${options.https ? '__Host-' : ''}csrf`
    }
    options.cookie = options.cookie || {}
    if (options.cookie.secure === undefined) {
      options.cookie.secure = !!options.https
    }

    nuxt.options.runtimeConfig.csurf = defu(nuxt.options.runtimeConfig.csurf, options as RuntimeConfig['csurf'])
    addServerHandler({ handler: resolve('runtime/server/middleware/csrf') })

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    addImports(['useCsrf', 'useCsrfFetch'].map(key => ({
      name: key,
      as: key,
      from: resolve('runtime/composables')
    })))
  }
})
