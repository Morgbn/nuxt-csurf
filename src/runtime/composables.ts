import { useNuxtApp, useFetch } from '#app'

import type { FetchError } from 'ofetch'
import type { NitroFetchRequest } from 'nitropack'
import type { Ref } from 'vue'
import type { KeyOfRes, AsyncData, PickFrom } from 'nuxt/dist/app/composables/asyncData'
import type { FetchResult, UseFetchOptions } from 'nuxt/dist/app/composables/fetch'

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

export function useCsrfFetch<
  ResT = void,
  ErrorT = FetchError,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  _ResT = ResT extends void ? FetchResult<ReqT> : ResT,
  Transform extends (res: _ResT) => any = (res: _ResT) => _ResT,
  PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>
> (
  request: Ref<ReqT> | ReqT | (() => ReqT),
  opts?: UseFetchOptions<_ResT, Transform, PickKeys, ReqT>
): AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, ErrorT | null> {
  const { csrf } = useCsrf()

  opts = opts || {}
  opts.headers = (opts.headers || {}) as Record<string, string>
  opts.headers['csrf-token'] = csrf // add csrftoken to req headers

  return useFetch<ResT, ErrorT, ReqT, _ResT, Transform, PickKeys>(request, opts)
}
