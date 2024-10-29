import { defineNuxtConfig } from 'nuxt/config'
import module from '../src/module'

export default defineNuxtConfig({
  modules: [
    module
  ],
  routeRules: {
    '/api/nocsrf': {
      csurf: false
    }
  },
  nitro: {
    prerender: { routes: ['/'] }
  },
  csurf: {
    https: process.env.NODE_ENV === 'production',
    methodsToProtect: ['POST'],
    headerName: 'X-CSRF-TOKEN'
  }
})
