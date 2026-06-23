<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from './lib/supabaseClient'

const products = ref<any[]>([])

onMounted(async () => {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('❌ Error:', error.message)
  } else {
    products.value = data
    console.log('✅ Productos:', data)
  }
})
</script>

<template>
  <div>
    <h1>Eva Inventory</h1>
    <p>Productos encontrados: {{ products.length }}</p>
    <pre>{{ products }}</pre>
  </div>
</template>