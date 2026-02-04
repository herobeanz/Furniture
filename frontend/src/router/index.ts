import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: () => import('../views/CategoryView.vue'),
  },
  {
    path: '/product/:slug',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('../views/WishlistView.vue'),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
