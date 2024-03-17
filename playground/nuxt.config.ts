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
  csurf: {
    https: false,
    methodsToProtect: ['POST']
  }
})
