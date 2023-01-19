import { useNuxtApp, useFetch } from '#app'

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

export function useCsrfFetch (url: any, options?: any) {
  const { csrf } = useCsrf()
  options.headers = options.headers || {}
  options.headers['csrf-token'] = csrf // add csrftoken to req headers
  return useFetch(url, options)
}
