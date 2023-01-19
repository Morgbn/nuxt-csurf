import { defineNuxtConfig } from 'nuxt/config'
import module from '../src/module'

export default defineNuxtConfig({
  modules: [
    module
  ],
  csurf: {
    https: false,
    excludedUrls: [['/no.*', 'i'], '/test-without-csrf']
  }
})
