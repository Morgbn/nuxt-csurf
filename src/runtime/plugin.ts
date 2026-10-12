import { useCsrf } from './composables'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const csrfFetch = $fetch.create({
    onRequest({ options }) {
      const { csrf, headerName } = useCsrf()
      options.headers = new Headers(options.headers || {})
      options.headers.append(headerName, csrf)
    }
  })
  return {
    provide: { csrfFetch }
  }
})

declare module '#app' {
  interface NuxtApp {
    $csrfFetch: typeof $fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $csrfFetch: typeof $fetch
  }
}
