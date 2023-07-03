import { useNuxtApp, useFetch, useLazyFetch } from '#app'

export function useCsrf () {
  const nuxtApp = useNuxtApp()
  if (process.server) {
    const res = nuxtApp.ssrContext?.event.node.res ?? {}
    if ('_csrftoken' in res) {
      nuxtApp.payload.csrfToken = res._csrftoken // expose csrftoken to client
    }
  }
  return { csrf: nuxtApp.payload.csrfToken }
}

function wrapWithCsrf<T extends Array<any>, U> (fn: (...args: T) => U) {
  return (...args: T): U => {
    const { csrf } = useCsrf()
    args[1] = args[1] || {}
    args[1].headers = (args[1].headers || {}) as Record<string, string>
    args[1].headers['csrf-token'] = csrf // add csrftoken to req headers
    return fn(...args)
  }
}

export const useCsrfFetch = wrapWithCsrf(useFetch)

export const useLazyCsrfFetch = wrapWithCsrf(useLazyFetch)
