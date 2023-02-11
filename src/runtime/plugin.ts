import { $fetch } from 'ofetch'
import type { FetchOptions } from 'ofetch'
import { defineNuxtPlugin, useCsrf } from '#imports'

export default defineNuxtPlugin(() => {
  const { csrf } = useCsrf()
  return {
    provide: {
      csrfFetch: (request: string, options?: FetchOptions, fetch = $fetch) => {
        if (!options) { options = {} }
        options.headers = (options.headers || {}) as Record<string, string>
        options.headers['csrf-token'] = csrf
        return fetch(request, options)
      }
    }
  }
})
