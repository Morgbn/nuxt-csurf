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
✅ TypeScript

## Setup

```sh
yarn add nuxt-csurf # yarn
npm i nuxt-csurf # npm
```

## Usage

The only thing you need to do to use the module in the default configuration is to register the module in the `modules` array in `nuxt.config.ts`:

```javascript
// nuxt.config.js
{
  modules: [
    "nuxt-csurf",
  ],
  csurf: { // optional
    https: false, // default true if in production
    cookieKey: '', // "__Host-csrf" if https is true otherwise just "csrf"
    cookie: { // CookieSerializeOptions from unjs/cookie-es
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    },
    methodsToProtect: ['POST', 'PUT', 'PATCH'], // the request methods we want CSRF protection for
    encryptSecret: /** a 32 bits secret */, // only for non serverless runtime, random bytes by default
    encryptAlgorithm: 'aes-256-cbc', // by default 'aes-256-cbc' (node), 'AES-CBC' (serverless)
    addCsrfTokenToEventCtx: true // default false, to run useCsrfFetch on server set it to true
  } 
}
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
