
import * as csrf from 'uncsrf'
import { defineEventHandler, getCookie, setCookie, getHeader, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

const csrfConfig = useRuntimeConfig().csurf

export default defineEventHandler(async (event) => {
  let secret = getCookie(event, csrfConfig.cookieKey)
  if (!secret) {
    secret = csrf.randomSecret()
    setCookie(event, csrfConfig.cookieKey, csrfConfig.secret, csrfConfig.cookie)
  }

  Object.defineProperty(event.node.res, '_csrftoken', {
    value: await csrf.create(secret ?? '', csrfConfig.secretKey, csrfConfig.encryptAlgorithm),
    enumerable: true
  })

  const method = event.node.req.method ?? ''
  if (!csrfConfig.methodsToProtect.includes(method)) { return }

  // verify the incoming csrf token
  const url = event.node.req.url ?? ''
  const excluded = csrfConfig.excludedUrls?.filter((el: string|[string, string]) =>
    Array.isArray(el) ? new RegExp(...el).test(url) : el === url
  ).length > 0
  const token = getHeader(event, 'csrf-token') ?? ''
  if (!excluded && !(await csrf.verify(secret ?? '', token, csrfConfig.secretKey, csrfConfig.encryptAlgorithm))) {
    throw createError({
      statusCode: 403,
      name: 'EBADCSRFTOKEN',
      statusMessage: 'CSRF Token Mismatch'
    })
  }
})
