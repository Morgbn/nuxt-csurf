<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1>nuxt-csurf playground</h1>

    <section>
      <h3>Fetched on load — GET <code>/api/data</code></h3>
      <pre>{{ preFetchedData }}</pre>

      <h3>Fetched on demand (<code>immediate: false</code> + <code>execute()</code>) — GET <code>/api/data</code></h3>
      <button @click="runLazyFetch()">
        Run lazy useCsrfFetch
      </button>
      <br>
      <br>
      <pre v-if="lazyData">{{ lazyData }}</pre>
    </section>

    <hr>

    <section>
      <h2>2. Imperative — <code>$csrfFetch</code> / <code>$fetch</code></h2>
      <p><small>Use these inside event handlers, watchers, or anywhere after mount.</small></p>

      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <button @click="run(false, '/test')">
          POST /test (without csrf header)
        </button>
        <button @click="run(false, '/test', { headers: { [headerName]: 'bad-token' } })">
          POST /test (with bad csrf header)
        </button>
        <button @click="run(true, '/test')">
          POST /test (with csrf header)
        </button>
        <button @click="run(false, '/test', { method: 'PUT' })">
          PUT /test (without csrf header, method not protected <pre>methodsToProtect: ['POST']</pre>)
        </button>
        <button @click="run(false, '/nocsrf')">
          POST /nocsrf (without csrf header, route not protected <pre>routeRules: { '/api/nocsrf': { csurf: false } }</pre>)
        </button>
        <button @click="run(true, '/error')">
          POST /error (throw an error one time in two)
        </button>
      </div>

      <br>
      <br>
      <pre v-if="msg" :style="{ color: msgColor }">{{ msg }}</pre>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCsrfFetch, useLazyCsrfFetch, useNuxtApp, useRuntimeConfig } from '#imports'

const { $csrfFetch } = useNuxtApp()
const headerName = useRuntimeConfig().public.csurf.headerName

const { data: preFetchedData } = useCsrfFetch('/api/data', { params: { d: 'specific' } })
// Need "addCsrfTokenToEventCtx" to be true in csurf config (in nuxt.config.js)
// const { data: preFetchedData } = useCsrfFetch('/api/data', { method: 'post', body: { d: 'specific' } })

const { data: lazyData, execute: runLazyFetch } = useLazyCsrfFetch('/api/data', {
  params: { d: 'on-demand' },
  immediate: false
})

const msg = ref(null)
const msgColor = ref('green')
const run = async (withCsrf, url, options = {}) => {
  msg.value = null
  msgColor.value = 'green'
  let error
  const fetcher = withCsrf ? $csrfFetch : $fetch
  const data = await fetcher('/api' + url, { method: 'POST', ...options })
    .catch(({ data }) => {
      error = data
      return null
    })
  msg.value = data || error
  if (error) msgColor.value = 'red'
}
</script>

<style lang="css">
pre {
  display: inline-block;
  background-color: lightgrey;
  margin: 0;
}
</style>
