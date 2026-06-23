<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function signIn() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  loading.value = true
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (err) {
    error.value = 'Invalid email or password.'
    return
  }
  router.push('/')
}
</script>

<template>
  <div class="auth-screen">
    <div class="auth-card">
      <div class="auth-logo">📦</div>
      <h1>Sign in</h1>
      <p class="auth-subtitle">Eva Inventory</p>

      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="you@example.com" autocomplete="email" />
      </div>

      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" autocomplete="current-password"
          @keyup.enter="signIn" />
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>

      <button class="btn btn-primary" :disabled="loading" @click="signIn">
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>

      <p class="auth-link">
        Don't have an account?
        <a @click="$router.push('/signup')">Sign up</a>
      </p>
    </div>
  </div>
</template>