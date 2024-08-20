import { defineNuxtModule, createResolver, addServerHandler, addServerPlugin, addImports, addPlugin } from '@nuxt/kit'
import { defuReplaceArray } from './runtime/utils'
import type { ModuleOptions } from './types'

export * from './types'

const defaultOptions: ModuleOptions = {
  https: process.env.NODE_ENV === 'production',
  cookieKey: '',
  cookie: {
    path: '/',
    httpOnly: true,
    sameSite: 'strict'
  },
  headerName: 'csrf-token',
  methodsToProtect: ['POST', 'PUT', 'PATCH']
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-csurf',
    configKey: 'csurf'
  },
  // defaults: …, // don't use defaults (to prevent arrays from being merged)
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    options = defuReplaceArray(options, defaultOptions)

    if (!options.cookieKey) {
      options.cookieKey = `${options.https ? '__Host-' : ''}csrf`
    }
    options.cookie = options.cookie || {}
    if (options.cookie.secure === undefined) {
      options.cookie.secure = !!options.https
    }

    nuxt.options.runtimeConfig.csurf = defuReplaceArray(nuxt.options.runtimeConfig.csurf, { ...options })
    nuxt.options.runtimeConfig.public.csurf = { headerName: nuxt.options.runtimeConfig.csurf.headerName }

    if (options.enabled !== false) {
      addServerHandler({ handler: resolve('runtime/server/middleware/csrf') })
      addServerPlugin(resolve('runtime/server/plugin/csrf'))
    }

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    addImports(['useCsrf', 'useCsrfFetch', 'useLazyCsrfFetch'].map(key => ({
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
  interface PublicRuntimeConfig {
    csurf: Pick<ModuleOptions, 'headerName'>
  }
}

declare module 'nitropack' {
  interface NitroRouteConfig {
    csurf?: Partial<ModuleOptions> | false
  }
}
