import * as csrf from 'uncsrf'
import { getCookie, setCookie } from 'h3'
import type { NitroApp } from 'nitropack'
import { useSecretKey } from '../helpers'
import { useRuntimeConfig, getRouteRules } from '#imports'
import { defuReplaceArray } from '../../utils'

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
          const mergedConfig = defuReplaceArray(csurf, csrfConfig)
          setCookie(event, cookieKey, secret, mergedConfig.cookie)
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
