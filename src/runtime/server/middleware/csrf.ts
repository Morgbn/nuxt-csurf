import * as csrf from 'uncsrf'
import { useSecretKey } from '../helpers'
import { defuReplaceArray } from '../../utils'
// Import h3 utilities from `#imports` (Nitro auto-imports) rather than `h3`,
// so they resolve to the same h3 instance Nitro uses to build the event.
// This keeps the module compatible with both h3 v1 and v2.
import { defineEventHandler, getCookie, getHeader, createError, useRuntimeConfig, getRouteRules } from '#imports'

const baseConfig = useRuntimeConfig().csurf

export default defineEventHandler(async (event) => {
  const { csurf } = getRouteRules(event)
  if (csurf === false || csurf?.enabled === false) return // csrf protection disabled for this route

  const csrfConfig = defuReplaceArray(csurf, baseConfig)
  const method = event.method ?? ''
  const methodsToProtect = csrfConfig.methodsToProtect ?? []
  if (!methodsToProtect.includes(method)) return

  const secret = getCookie(event, csrfConfig.cookieKey!) ?? ''
  const token = getHeader(event, baseConfig.headerName!) ?? ''
  // verify the incoming csrf token
  const isValidToken = await csrf.verify(secret, token, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
  if (!isValidToken) {
    throw createError({
      statusCode: 403,
      name: 'EBADCSRFTOKEN',
      statusMessage: 'CSRF Token Mismatch',
      message: !secret ? 'CSRF Cookie not found' : (!token ? 'CSRF Token not found' : 'CSRF Token invalid')
    })
  }
})
