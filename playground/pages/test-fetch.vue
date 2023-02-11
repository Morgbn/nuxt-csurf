<template>
  <div>
    <h1>Test CSRF <small>with $csrfFetch</small></h1>
    <p><small>or test <nuxt-link to="/">with useCsrfFetch</nuxt-link></small></p>
    <button @click="testPost()">
      POST /test (without csrf header)
    </button>
    <button @click="testPost(true)">
      POST /test (with csrf header)
    </button>
    <br>
    <br>
    <pre v-if="msg" :style="{ color: msgColor }">{{ msg }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNuxtApp } from '#imports'

const { $csrfFetch } = useNuxtApp()

const msg = ref(null)
const msgColor = ref('green')
const testPost = async (withCsrf) => {
  msg.value = null
  msgColor.value = 'green'
  let error
  const fetch = withCsrf ? $csrfFetch : $fetch
  const data = await fetch('/api/test', { method: 'POST', headers: { 'test-header': 'ok' } })
    .catch(({ data }) => {
      error = data
      return null
    })
  msg.value = data || error
  if (error) { msgColor.value = 'red' }
}
</script>
