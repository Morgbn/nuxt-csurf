import { type FetchOptions, $fetch } from 'ofetch'
import type { Plugin } from '#app'
import { defineNuxtPlugin, useCsrf } from '#imports'

type CsrfFetch = (request: string, options?: FetchOptions, fetch?: typeof $fetch) => Promise<any>

const plugin: Plugin<{ csrfFetch: CsrfFetch }> = defineNuxtPlugin(() => {
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

export default plugin
