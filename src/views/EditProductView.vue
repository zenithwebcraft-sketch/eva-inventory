<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const route = useRoute()
const saving = ref(false)
const loading = ref(true)
const id = route.params.id as string

const form = ref({
  title: '', category: '', brand: '', model: '',
  condition: '', online_price: '', source: '',
  source_product_id: '', final_price: '',
  quantity_available: '1', location_code: '',
  image_folder_url: '',
})

onMounted(async () => {
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  if (data) {
    form.value = {
      ...data,
      online_price: data.online_price ?? '',
      final_price: data.final_price ?? '',
      quantity_available: String(data.quantity_available ?? 1),
    }
  }
  loading.value = false
})

async function submit() {
  if (!form.value.title || !form.value.final_price || !form.value.location_code) {
    alert('Please fill in Title, Final Price, and Location.')
    return
  }
  saving.value = true
  const { error } = await supabase.from('products').update({
    ...form.value,
    online_price: form.value.online_price ? Number(form.value.online_price) : null,
    final_price: Number(form.value.final_price),
    quantity_available: Number(form.value.quantity_available),
  }).eq('id', id)
  saving.value = false
  if (error) { alert('Error: ' + error.message); return }
  router.push('/')
}
</script>

<template>
  <div class="form-screen">
    <div class="header">
      <button class="back-btn" @click="router.push('/')">← Back</button>
      <h1 style="margin-top: 0.5rem;">Edit product</h1>
    </div>

    <div v-if="loading" class="empty-state">
      <p>Loading...</p>
    </div>

    <template v-else>
      <div class="form-body">
        <p class="section-label">Required</p>

        <div class="field">
          <label>Title *</label>
          <input v-model="form.title" type="text" />
        </div>

        <div class="field-row">
          <div class="field">
            <label>Final price *</label>
            <input v-model="form.final_price" type="number" />
          </div>
          <div class="field">
            <label>Location *</label>
            <input v-model="form.location_code" type="text" />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Category *</label>
            <select v-model="form.category">
              <option value="">Select...</option>
              <option>Phones</option>
              <option>Tablets</option>
              <option>Laptops</option>
              <option>Accessories</option>
              <option>Other</option>
            </select>
          </div>
          <div class="field">
            <label>Quantity *</label>
            <input v-model="form.quantity_available" type="number" min="1" />
          </div>
        </div>

        <p class="section-label">Details</p>

        <div class="field-row">
          <div class="field">
            <label>Brand</label>
            <input v-model="form.brand" type="text" />
          </div>
          <div class="field">
            <label>Model</label>
            <input v-model="form.model" type="text" />
          </div>
        </div>

        <div class="field">
          <label>Condition</label>
          <select v-model="form.condition">
            <option value="">Select...</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <p class="section-label">Sourcing</p>

        <div class="field-row">
          <div class="field">
            <label>Online price</label>
            <input v-model="form.online_price" type="number" />
          </div>
          <div class="field">
            <label>Source</label>
            <input v-model="form.source" type="text" />
          </div>
        </div>

        <div class="field">
          <label>Source product ID</label>
          <input v-model="form.source_product_id" type="text" />
        </div>

        <div class="field">
          <label>Image folder URL</label>
          <input v-model="form.image_folder_url" type="text" />
        </div>
      </div>

      <div class="bottom-bar" style="display: flex; flex-direction: column; gap: 0.625rem;">
        <button class="btn btn-primary" :disabled="saving" @click="submit">
          {{ saving ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </template>
  </div>
</template>