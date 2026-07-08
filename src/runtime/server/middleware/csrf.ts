import * as csrf from 'uncsrf'
import { useSecretKey, useMergedRuntimeRouteRulesConfig } from '../helpers'
import { defineEventHandler, getCookie, getHeader, createError } from '#imports'

export default defineEventHandler(async (event) => {
  const csrfConfig = useMergedRuntimeRouteRulesConfig(event)
  if (csrfConfig.disabled) return // csrf protection disabled for this route

  const method = event.method ?? ''
  const methodsToProtect = csrfConfig.methodsToProtect ?? []
  if (!methodsToProtect.includes(method)) return

  const secret = getCookie(event, csrfConfig.cookieKey) ?? ''
  const token = getHeader(event, csrfConfig.headerName) ?? ''
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
