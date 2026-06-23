import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const user = ref<any>(null)
const profile = ref<{ full_name: string; role: string } | null>(null)
const loading = ref(true)

// Carga el perfil desde la tabla profiles
async function loadProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', userId)
    .single()
  profile.value = data
}

// Inicializa la sesión al arrancar la app
async function initAuth() {
  loading.value = true
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    user.value = session.user
    await loadProfile(session.user.id)
  }
  loading.value = false

  // Escucha cambios de sesión (login, logout, token refresh)
  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session?.user ?? null
    if (session?.user) {
      await loadProfile(session.user.id)
    } else {
      profile.value = null
    }
  })
}

async function signOut() {
  await supabase.auth.signOut()
  user.value = null
  profile.value = null
}

export function useAuth() {
  return { user, profile, loading, initAuth, signOut, loadProfile }
}