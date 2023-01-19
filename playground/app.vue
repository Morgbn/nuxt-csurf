<template>
  <div>
    <h1>Test CSRF</h1>
    <p><b>CSRF Token =  </b>{{ csrf }}</p>
    <button @click="testPost()">
      POST /test (without csrf header)
    </button>
    <button @click="testPost(true)">
      POST /test (with csrf header)
    </button>
    <button @click="testPost(false, '/nocsrf')">
      POST /nocsrf (without csrf header)
    </button>
    <br>
    <br>
    <pre v-if="msg" :style="{ color: msgColor }">{{ msg }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCsrf, useCsrfFetch, useFetch } from '#imports'

const { csrf } = useCsrf()

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
</script>
