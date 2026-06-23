<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const products = ref<any[]>([])
const loading = ref(true)

const statusMap: Record<string, string> = {
  por_listar: 'To list',
  listado: 'Listed',
  vendido: 'Sold',
  reservado: 'Reserved',
}

async function fetchProducts() {
  loading.value = true
  const { data } = await supabase
    .from('products')
    .select('id, title, category, location_code, status')
    .order('created_at', { ascending: false })
  products.value = data ?? []
  loading.value = false
}

onMounted(fetchProducts)
</script>

<template>
  <div class="screen">
    <div class="header">
      <h1>Welcome, Eva 👋</h1>
      <p>Your inventory</p>
    </div>

    <div class="content">
      <!-- Loading -->
      <div v-if="loading" class="empty-state">
        <p>Loading...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="products.length === 0" class="empty-state">
        <div class="icon">📦</div>
        <p>You don't have any products yet.</p>
      </div>

      <!-- Product list -->
      <div v-else class="product-list">
        <button
          v-for="product in products"
          :key="product.id"
          class="product-row"
          @click="router.push(`/edit/${product.id}`)"
        >
          <div class="product-thumb">📦</div>
          <div class="product-info">
            <div class="product-title">{{ product.title }}</div>
            <div class="product-meta">
              {{ [product.category, product.location_code].filter(Boolean).join(' · ') }}
            </div>
          </div>
          <span class="status-badge">
            {{ statusMap[product.status] ?? product.status }}
          </span>
        </button>
      </div>
    </div>

    <div class="bottom-bar">
      <button class="btn btn-primary" @click="router.push('/new')">
        + Create a new product
      </button>
    </div>
  </div>
</template>