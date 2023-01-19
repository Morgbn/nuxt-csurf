# 🏄‍♂️ Nuxt Cross-Site Request Forgery (CSRF) Prevention

Create a middleware for CSRF token creation and validation. 

## Setup

```sh
yarn add nuxt-csrf # yarn
npm i nuxt-csrf # npm
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
    excludedUrls: ['/nocsrf1', ['/nocsrf2/.*', 'i']], // any URLs we want to exclude from CSRF protection
    encryptSecret: /** a 32 bits secret */, // random bytes by default
    encryptAlgorithm: 'aes-256-cbc'
  } 
}
```

### useCsrfFetch
This composable provides a convenient wrapper around `useFetch`. It automatically add the CSRF token in headers.

```javascript
// app.vue
const { data, pending, error, refresh } = useCsrfFetch('/api/login', { query: param1: 'value1' })
```

## Credits

- inspired by [tiny-csrf](https://github.com/valexandersaulys/tiny-csrf) and [expressjs/csurf](https://github.com/expressjs/csurf)