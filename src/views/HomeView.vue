<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { profile, signOut } = useAuth()
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

async function handleSignOut() {
  await signOut()
  router.push('/signin')
}

onMounted(fetchProducts)
</script>

<template>
  <div class="screen">
    <div class="header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h1>Welcome, {{ profile?.full_name ?? '...' }} 👋</h1>
          <p>Your inventory</p>
        </div>
        <button class="btn-signout" @click="handleSignOut">Sign out</button>
      </div>
    </div>

    <div class="content">
      <div v-if="loading" class="empty-state">
        <p>Loading...</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <div class="icon">📦</div>
        <p>You don't have any products yet.</p>
      </div>

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