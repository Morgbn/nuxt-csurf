![nuxt-oa-social-card](https://github.com/Morgbn/nuxt-csurf/assets/25689856/7f49b654-c682-4f15-9e40-6ba9644e28ac)

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

# Nuxt Csurf
Cross-Site Request Forgery (CSRF) prevention. \
Create a middleware for CSRF token creation and validation.

✅ Supports Node.js server & serverless environments \
✅ Supports both universal and client-side rendering (`ssr: true|false`) \
✅ Per-route configuration \
✅ TypeScript \
❌ Don't support static hosting and [nitro prerender](https://nitro.unjs.io/config#prerender) due to certain limitations [*](#limitations)

## Installation

```sh
npx nuxi@latest module add csurf
```

## Global configuration

```javascript
// nuxt.config.js
export default defineNuxtConfig({
  modules: ['nuxt-csurf'],
  csurf: { // optional
    https: false, // default true if in production
    cookieKey: '', // "__Host-csrf" if https is true otherwise just "csrf"
    cookie: { // CookieSerializeOptions from unjs/cookie-es
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    },
    methodsToProtect: ['POST', 'PUT', 'PATCH'], // the request methods we want CSRF protection for
    encryptSecret: /** a 32 bits secret */, // for stateless server (like serverless runtime), random bytes by default
    encryptAlgorithm: 'aes-256-cbc', // by default 'aes-256-cbc' (node), 'AES-CBC' (serverless)
    addCsrfTokenToEventCtx: true, // default false, to run useCsrfFetch on server set it to true
    headerName: 'csrf-token' // the header where the csrf token is stored
  } 
})
```

## Per route configuration
To enable per-route configuration, use the routeRules like following:
```javascript
export default defineNuxtConfig({
  routeRules: {
    '/api/nocsrf': {
      csurf: false
    },
    '/api/test': {
      csurf: {
        methodsToProtect: ['POST'] // protect POST request only
      }
    }
  }
})
```

### useCsrfFetch
This composable provides a convenient wrapper around `useFetch`. It automatically adds the CSRF token in headers.

```javascript
const { data, pending, error, refresh } = useCsrfFetch('/api/login', { query: param1: 'value1' })
```

### $csrfFetch
This helper provides a convenient wrapper around `$fetch`. It automatically adds the CSRF token in headers.

```javascript
const { $csrfFetch } = useNuxtApp()
const { data } = await $csrfFetch('/api/login', { method: 'POST', body: …, headers: … })
```

### useCsrf
Use this composable if you need to access to the CSRF token value.

```javascript
const { csrf } = useCsrf()
console.log(csrf) // something like: mo4+MrFaeXP7fhAie0o2qw==:tLUaqtHW6evx/coGQVAhtGAR+v6cxgFtrqmkOsuAMag8PHRnMwpbGGUO0TPJjL+4
```

### Try production on localhost (`yarn preview`):
```.env
NITRO_CSURF_HTTPS=false
NITRO_CSURF_COOKIE_KEY=csrf
```

## Limitations
The CSRF Token value is stored in the DOM as described [in Owasp's CSRF cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#storing-the-csrf-token-value-in-the-dom). So the DOM has to be generated for each new page request, which is not the case with a static site (or prerendered routes). See error #42

## Credits

- inspired by [tiny-csrf](https://github.com/valexandersaulys/tiny-csrf) and [expressjs/csurf](https://github.com/expressjs/csurf)
- see [OWASP CSRF cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)


[npm-version-src]: https://img.shields.io/npm/v/nuxt-csurf/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-csurf

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-csurf.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-csurf

[license-src]: https://img.shields.io/npm/l/@nuxt/image.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-csurf

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
