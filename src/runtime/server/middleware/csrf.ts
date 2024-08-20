
import * as csrf from 'uncsrf'
import { defineEventHandler, getCookie, getHeader, createError } from 'h3'
import { useRuntimeConfig, getRouteRules } from '#imports'
import { useSecretKey } from '../helpers'
import { defuReplaceArray } from '../../utils'

const baseConfig = useRuntimeConfig().csurf

export default defineEventHandler(async (event) => {
  const { csurf } = getRouteRules(event)
  if (csurf === false || csurf?.enabled === false) { return } // csrf protection disabled for this route

  const csrfConfig = defuReplaceArray(csurf, baseConfig)
  const method = event.node.req.method ?? ''
  const methodsToProtect = csrfConfig.methodsToProtect ?? []
  if (!methodsToProtect.includes(method)) { return }

  const secret = getCookie(event, csrfConfig.cookieKey!) ?? ''
  const token = getHeader(event, baseConfig.headerName!) ?? ''
  // verify the incoming csrf token
  const isValidToken = await csrf.verify(secret, token, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
  if (!isValidToken) {
    throw createError({
      statusCode: 403,
      name: 'EBADCSRFTOKEN',
      statusMessage: 'CSRF Token Mismatch',
      message: !secret ? 'CSRF Cookie not found' : (!token ? 'CSRF Token not found' : 'CSRF Token invalid'),
    })
  }
})
