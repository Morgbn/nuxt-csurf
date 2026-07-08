import assert from 'node:assert'
import { importEncryptSecret } from 'uncsrf'
import type { H3Event } from 'h3'
import type { ModuleOptions } from '../../types'
import { defuReplaceArray } from '../utils'
// Import h3 utilities from `#imports` (Nitro auto-imports) rather than `h3`,
// so they resolve to the same h3 instance Nitro uses to build the event.
// This keeps the module compatible with both h3 v1 and v2.
import { useRuntimeConfig, getRouteRules } from '#imports'

let secretKey: Awaited<ReturnType<typeof importEncryptSecret>>
export const useSecretKey = async (options: ModuleOptions) => secretKey
  ? secretKey
  : (secretKey = await importEncryptSecret(options.encryptSecret, options.encryptAlgorithm))

export function useMergedRuntimeRouteRulesConfig(event: H3Event) {
  const routeConfig = getRouteRules(event).csurf
  const runtimeConfig = useRuntimeConfig(event).csurf
  const mergedConfig = typeof routeConfig === 'object' && routeConfig ? defuReplaceArray(routeConfig, runtimeConfig) : runtimeConfig
  assert(mergedConfig.cookieKey, 'cookieKey is required')
  assert(mergedConfig.headerName, 'headerName is required')
  const disabled = routeConfig === false || mergedConfig.enabled === false
  return { ...mergedConfig, disabled, cookieKey: mergedConfig.cookieKey, headerName: mergedConfig.headerName }
}
