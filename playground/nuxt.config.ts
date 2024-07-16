import { defineNuxtConfig } from 'nuxt/config'
import module from '../src/module'

export default defineNuxtConfig({
  modules: [
    module
  ],
  nitro: {
    prerender: { routes: ['/'] }
  },
  routeRules: {
    '/api/nocsrf': {
      csurf: false
    }
  },
  csurf: {
    https: process.env.NODE_ENV === 'production',
    methodsToProtect: ['POST']
  }
})
