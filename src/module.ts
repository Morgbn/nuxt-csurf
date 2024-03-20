import { defineNuxtModule, createResolver, addServerHandler, addServerPlugin, addImports, addPlugin } from '@nuxt/kit'
import { defuReplaceArray } from './runtime/utils'
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
    methodsToProtect: ['POST', 'PUT', 'PATCH']
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

    nuxt.options.runtimeConfig.csurf = defuReplaceArray(nuxt.options.runtimeConfig.csurf, { ...options })

    if (options.enabled !== false) {
      addServerHandler({ handler: resolve('runtime/server/middleware/csrf') })
      addServerPlugin(resolve('runtime/server/plugin/csrf'))
    }

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
    csurf: ModuleOptions
  }
}

declare module 'nitropack' {
  interface NitroRouteConfig {
    csurf?: Partial<ModuleOptions> | false;
  }
}
