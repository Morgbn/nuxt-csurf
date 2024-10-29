import { useFetch, type useLazyFetch, useNuxtApp, useRuntimeConfig } from 'nuxt/app'

type UseCsrfFetch = typeof useFetch
type UseLazyCsrfFetch = typeof useLazyFetch

/**
 * Fetch data from an API endpoint protected by a CSRF token. SSR-friendly composable.
 * See {@link https://nuxt.com/docs/api/composables/use-fetch}
 * @param url The URL to fetch
 * @param options extends $fetch options and useAsyncData options
 */
export const useCsrfFetch: UseCsrfFetch = (url, options) => {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$csrfFetch
  })
}

export const useLazyCsrfFetch: UseLazyCsrfFetch = (url, options) => {
  return useFetch(url, {
    ...options,
    lazy: true,
    $fetch: useNuxtApp().$csrfFetch
  })
}

/**
 * Retrieves the CSRF token from either the server or the client-side context.
 * See {@link https://github.com/Morgbn/nuxt-csurf#usecsrf}
 * @returns
 * - `csrf`: The CSRF token, either retrieved from the server or from the meta tag in the client.
 * - `headerName`: The name of the CSRF header, as configured in the public runtime configuration. Defaults to an empty string if not set.
 */
export function useCsrf() {
  const headerName = useRuntimeConfig().public.csurf.headerName ?? ''
  if (import.meta.server) {
    return { csrf: useNuxtApp().ssrContext?.event?.context?.csrfToken, headerName }
  }
  const metaTag = window.document.querySelector('meta[name="csrf-token"]')
  return { csrf: metaTag?.getAttribute('content'), headerName }
}
