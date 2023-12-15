<template>
  <div>
    <h1>Test CSRF <small>with useCsrfFetch</small></h1>
    <p><small>or test <nuxt-link to="/test-fetch">with $csrfFetch</nuxt-link></small></p>
    <button @click="testPost()">
      POST /test (without csrf header)
    </button>
    <button @click="testPost(true)">
      POST /test (with csrf header)
    </button>
    <button @click="testPost(false, '/nocsrf')">
      POST /nocsrf (without csrf header)
    </button>
    <button @click="testPost(true, '/error')">
      POST /error (throw an error one time in two)
    </button>
    <br>
    <br>
    <pre
      v-if="msg"
      :style="{ color: msgColor }"
    >{{ msg }}</pre>
    <hr>
    <h3>Result of <pre style="display: inline-block; background-color: lightgrey;">/api/data</pre>:</h3>
    <pre>{{ preFetchedData }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCsrfFetch, useFetch } from '#imports'

const msg = ref(null)
const msgColor = ref('green')
const testPost = async (withCsrf, url = '/test') => {
  msg.value = null
  msgColor.value = 'green'
  const fetch = withCsrf ? useCsrfFetch : useFetch
  const { data, error } = await fetch('/api' + url, { method: 'POST' })
  msg.value = data.value || error.value
  if (error.value) { msgColor.value = 'red' }
}

const { data: preFetchedData } = useCsrfFetch('/api/data', { params: { d: 'specific' } })
// Need "addCsrfTokenToEventCtx" to be true in csurf config (in nuxt.config.js)
// const { data: preFetchedData } = useCsrfFetch('/api/data', { method: 'post', body: { d: 'specific' } })
</script>
