import { $fetch, type $Fetch } from 'ofetch'
import { useCsrf } from './composables'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const csrfFetch = $fetch.create({
    onRequest({ options }) {
      const { csrf, headerName } = useCsrf()
      options.headers = (options.headers || {}) as Record<string, string>
      options.headers[headerName] = csrf
    }
  })
  return {
    provide: { csrfFetch }
  }
})

declare module '#app' {
  interface NuxtApp {
    $csrfFetch: $Fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $csrfFetch: $Fetch
  }
}
