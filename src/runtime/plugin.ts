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

export default defineNuxtPlugin(() => {
  const { csrf } = useCsrf()
  return {
    provide: {
      csrfFetch: <T = any, R extends ResponseType = "json"> (request: FetchRequest, options?: FetchOptions<R>, fetch: $Fetch = $fetch): Promise<MappedType<R, T>> => {
        if (!options) { options = {} }
        options.headers = (options.headers || {}) as Record<string, string>
        options.headers['csrf-token'] = csrf
        return fetch(request, options)
      }
    }
  }
})
