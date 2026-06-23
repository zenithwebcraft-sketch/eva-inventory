import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewProductView from '../views/NewProductView.vue'
import EditProductView from '../views/EditProductView.vue'
import SignInView from '../views/SignInView.vue'
import SignUpView from '../views/SignUpView.vue'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',        component: HomeView,        meta: { requiresAuth: true } },
    { path: '/new',     component: NewProductView,  meta: { requiresAuth: true } },
    { path: '/edit/:id',component: EditProductView, meta: { requiresAuth: true } },
    { path: '/signin',  component: SignInView },
    { path: '/signup',  component: SignUpView },
  ],
})

router.beforeEach((to) => {
  const { user } = useAuth()
  if (to.meta.requiresAuth && !user.value) {
    return { path: '/signin' }
  }
  if ((to.path === '/signin' || to.path === '/signup') && user.value) {
    return { path: '/' }
  }
})

export default router