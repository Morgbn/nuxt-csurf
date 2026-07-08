import * as csrf from 'uncsrf'
import type { H3Event } from 'h3'
import type { NitroApp } from 'nitropack'
import { useSecretKey, useMergedRuntimeRouteRulesConfig } from '../helpers'
import { getCookie, setCookie, useRuntimeConfig } from '#imports'

type NitroAppPlugin = (nitro: NitroApp) => void

const defineNitroPlugin = (def: NitroAppPlugin): NitroAppPlugin => def

// Export runtime plugin
export default defineNitroPlugin((nitroApp) => {
  const { addCsrfTokenToEventCtx } = useRuntimeConfig().csurf

  if (addCsrfTokenToEventCtx) {
    nitroApp.hooks.hook('request', async (event) => {
      event.context.csrfToken = await getCsrfToken(event)
    })
    nitroApp.hooks.hook('render:html', async (html, { event }) => {
      html.head.push(`<meta name="csrf-token" content="${event.context.csrfToken}">`)
    })
  } else {
    nitroApp.hooks.hook('render:html', async (html, { event }) => {
      const csrfToken = await getCsrfToken(event)
      html.head.push(`<meta name="csrf-token" content="${csrfToken}">`)
    })
  }
})

async function getCsrfToken(event: H3Event) {
  const csrfConfig = useMergedRuntimeRouteRulesConfig(event)
  let secret = getCookie(event, csrfConfig.cookieKey)
  if (!secret) {
    secret = csrf.randomSecret()
    if (!csrfConfig.disabled) {
      setCookie(event, csrfConfig.cookieKey, secret, csrfConfig.cookie)
    }
  }
  return await csrf.create(secret, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
}
