import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewProductView from '../views/NewProductView.vue'
import EditProductView from '../views/EditProductView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/new', component: NewProductView },
    { path: '/edit/:id', component: EditProductView },
  ],
})

export default router