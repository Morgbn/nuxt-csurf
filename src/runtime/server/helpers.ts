import assert from 'node:assert'
import { importEncryptSecret } from 'uncsrf'
import type { H3Event } from 'h3'
import type { ModuleOptions } from '../../types'
import { defuReplaceArray } from '../utils'
// Import h3 utilities from `#imports` (Nitro auto-imports) rather than `h3`,
// so they resolve to the same h3 instance Nitro uses to build the event.
// This keeps the module compatible with both h3 v1 and v2.
import { useRuntimeConfig, getRouteRules } from '#imports'

let secretKey: ReturnType<typeof importEncryptSecret> | undefined
export const useSecretKey = (options: ModuleOptions & { generatedEncryptSecret?: string }) =>
  secretKey ??= resolveEncryptSecret(options).then(encryptSecret => importEncryptSecret(encryptSecret, options.encryptAlgorithm))

const APP_SECRET_MIN_LENGTH = 32

// a key derived from Nuxt's `appSecret` (Nuxt 4.6+) stays the same across builds and instances, unlike the generated one
async function resolveEncryptSecret(options: ModuleOptions & { generatedEncryptSecret?: string }) {
  if (options.encryptSecret) return options.encryptSecret

  const { appSecret } = useRuntimeConfig() as { appSecret?: unknown }
  if (typeof appSecret !== 'string' || appSecret.length < APP_SECRET_MIN_LENGTH) return options.generatedEncryptSecret

  // the HKDF parameters of Nuxt's `deriveSecret`, which is not importable on older Nuxt versions
  const encoder = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey('raw', encoder.encode(appSecret), 'HKDF', false, ['deriveBits'])
  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt: encoder.encode('nuxt'), info: encoder.encode('nuxt-csurf:encrypt') },
    key,
    192
  )

  // uncsrf takes the string's bytes as the key, which AES-256 needs to be 32 long
  return btoa(String.fromCharCode(...new Uint8Array(bits)))
}

export function useMergedRuntimeRouteRulesConfig(event: H3Event) {
  const routeConfig = getRouteRules(event).csurf
  const runtimeConfig = useRuntimeConfig(event).csurf
  const mergedConfig = typeof routeConfig === 'object' && routeConfig ? defuReplaceArray(routeConfig, runtimeConfig) : runtimeConfig
  assert(mergedConfig.cookieKey, 'cookieKey is required')
  assert(mergedConfig.headerName, 'headerName is required')
  const disabled = routeConfig === false || mergedConfig.enabled === false
  return { ...mergedConfig, disabled, cookieKey: mergedConfig.cookieKey, headerName: mergedConfig.headerName }
}
