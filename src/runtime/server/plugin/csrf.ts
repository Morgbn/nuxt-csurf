import * as csrf from 'uncsrf'
import type { NitroApp } from 'nitropack'
import { useSecretKey } from '../helpers'
// Import h3 utilities from `#imports` (Nitro auto-imports) rather than `h3`,
// so they resolve to the same h3 instance Nitro uses to build the event.
// This keeps the module compatible with both h3 v1 and v2.
import { getCookie, setCookie, useRuntimeConfig, getRouteRules } from '#imports'

type NitroAppPlugin = (nitro: NitroApp) => void

const defineNitroPlugin = (def: NitroAppPlugin): NitroAppPlugin => def

// Export runtime plugin
export default defineNitroPlugin((nitroApp) => {
  const csrfConfig = useRuntimeConfig().csurf
  const cookieKey = csrfConfig.cookieKey!

  if (csrfConfig.addCsrfTokenToEventCtx) {
    nitroApp.hooks.hook('request', async (event) => {
      const { csurf } = getRouteRules(event)
      const needCookie = !(csurf === false || csurf?.enabled === false)
      let secret = getCookie(event, cookieKey)
      if (!secret) {
        secret = csrf.randomSecret()
        if (needCookie) {
          setCookie(event, cookieKey, secret, csrfConfig.cookie)
        }
      }
      event.context.csrfToken = await csrf.create(secret, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
    })
    nitroApp.hooks.hook('render:html', async (html, { event }) => {
      html.head.push(`<meta name="csrf-token" content="${event.context.csrfToken}">`)
    })
  } else {
    nitroApp.hooks.hook('render:html', async (html, { event }) => {
      let secret = getCookie(event, cookieKey)
      if (!secret) {
        secret = csrf.randomSecret()
        setCookie(event, cookieKey, secret, csrfConfig.cookie)
      }

      const csrfToken = await csrf.create(secret, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm)
      html.head.push(`<meta name="csrf-token" content="${csrfToken}">`)
    })
  }
})
