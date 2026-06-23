<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const fullName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function signUp() {
  error.value = ''
  if (!fullName.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  loading.value = true

  // 1. Crear usuario en Supabase Auth
  const { data, error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (err || !data.user) {
    error.value = err?.message ?? 'Something went wrong.'
    loading.value = false
    return
  }

  // 2. Insertar perfil en tabla profiles
  await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: fullName.value,
    role: 'user',
  })

  loading.value = false
  router.push('/')
}
</script>

<template>
  <div class="auth-screen">
    <div class="auth-card">
      <div class="auth-logo">📦</div>
      <h1>Create account</h1>
      <p class="auth-subtitle">Eva Inventory</p>

      <div class="field">
        <label>Full name</label>
        <input v-model="fullName" type="text" placeholder="Eva García" autocomplete="name" />
      </div>

      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="you@example.com" autocomplete="email" />
      </div>

      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Min. 6 characters"
          autocomplete="new-password" @keyup.enter="signUp" />
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button class="btn btn-primary" :disabled="loading" @click="signUp">
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>

      <p class="auth-link">
        Already have an account?
        <a @click="$router.push('/signin')">Sign in</a>
      </p>
    </div>
  </div>
</template>