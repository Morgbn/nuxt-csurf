import * as csrf from 'uncsrf'
import { getCookie, setCookie } from 'h3'
import type { NitroApp } from 'nitropack'
import { useRuntimeConfig } from '#imports'
import { useSecretKey } from '../helpers'
type NitroAppPlugin = (nitro: NitroApp) => void

const defineNitroPlugin = (def: NitroAppPlugin): NitroAppPlugin => def

// Export runtime plugin
export default defineNitroPlugin((nitroApp) => {
  const csrfConfig = useRuntimeConfig().csurf
  const cookieKey = csrfConfig.cookieKey!

  nitroApp.hooks.hook("request", async (event)=>{
    let secret = getCookie(event, cookieKey);
    if (!secret) {
      secret = csrf.randomSecret();
      setCookie(event, cookieKey, secret, csrfConfig.cookie);
    }
    event.context.csrfToken = await csrf.create(secret, await useSecretKey(csrfConfig), csrfConfig.encryptAlgorithm);
  });

  nitroApp.hooks.hook("render:html", async (html, { event }) => {
    if(event.context?.csrfToken){
      return;
    }
    html.head.push(`<meta name="csrf-token" content="${event.context.csrfToken}">`);
  });
})
