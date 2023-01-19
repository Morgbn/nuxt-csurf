
import { randomUUID, randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { defineEventHandler, getCookie, setCookie, getHeader, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

const csrfConfig = useRuntimeConfig().csurf
const secrefBuffer = Buffer.from(csrfConfig.encryptSecret)

/**
 * Create a new CSRF token (encrypt secret using csrfConfig.encryptAlgorithm)
 */
const createCsrf = (secret: string): string => {
  const iv = randomBytes(16)
  const cipher = createCipheriv(csrfConfig.encryptAlgorithm, secrefBuffer, iv)
  const encrypted = cipher.update(secret, 'utf8', 'base64') +
    cipher.final('base64')
  return `${iv.toString('base64')}:${encrypted}`
}

/**
 * Check csrf token (decrypt secret using csrfConfig.encryptAlgorithm)
 */
const verifyCsrf = (secret: string, token: string): boolean => {
  const [iv, encrypted] = token.split(':')
  if (!iv || !encrypted) { return false }
  let decrypted
  try {
    const decipher = createDecipheriv(csrfConfig.encryptAlgorithm, secrefBuffer, Buffer.from(iv, 'base64'))
    decrypted = decipher.update(encrypted, 'base64', 'utf-8') +
      decipher.final('utf-8')
  } catch (error) {
    return false
  }
  return decrypted === secret
}

export default defineEventHandler((event) => {
  let secret = getCookie(event, csrfConfig.cookieKey)
  if (!secret) {
    secret = randomUUID()
    setCookie(event, csrfConfig.cookieKey, secret, csrfConfig.cookie)
  }

  Object.defineProperty(event.node.res, '_csrftoken', {
    value: createCsrf(secret),
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
  if (!excluded && !verifyCsrf(secret, token)) {
    throw createError({
      statusCode: 403,
      name: 'EBADCSRFTOKEN',
      statusMessage: 'CSRF Token Mismatch'
    })
  }
})
