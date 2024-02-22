import { $fetch } from 'ofetch'
import type { FetchOptions, FetchRequest, $Fetch } from 'ofetch'
import { defineNuxtPlugin, useCsrf } from '#imports'

// types copied from ofetch (not exposed by oftech)
interface ResponseMap {
    blob: Blob;
    text: string;
    arrayBuffer: ArrayBuffer;
    stream: ReadableStream<Uint8Array>;
}
type ResponseType = keyof ResponseMap | "json";
type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType;

type $CsrfFetch = <T = any, R extends ResponseType = "json">(request: FetchRequest, options?: FetchOptions<R>, fetch?: $Fetch) => Promise<MappedType<R, T>>

export default defineNuxtPlugin(() => {
  const { csrf } = useCsrf()
  const csrfFetch: $CsrfFetch = (request, options, fetch = $fetch) => {
    if (!options) { options = {} }
    options.headers = (options.headers || {}) as Record<string, string>
    options.headers['csrf-token'] = csrf
    return fetch(request, options)
  }
  return {
    provide: { csrfFetch }
  }
})

declare module '#app' {
  interface NuxtApp {
    $csrfFetch: $CsrfFetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $csrfFetch: $CsrfFetch
  }
}
