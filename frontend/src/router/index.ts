import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useTrackingStore } from '@/stores/tracking'
import { getAdminToken } from '@/services/api.client'

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
  {
    path: '/page/:slug',
    name: 'cms-page',
    component: () => import('../views/CmsPageView.vue'),
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../views/admin/DashboardView.vue'),
      },
      {
        path: 'inquiries',
        name: 'admin-inquiries',
        component: () => import('../views/admin/InquiriesListView.vue'),
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('../views/admin/ProductsListView.vue'),
      },
      {
        path: 'products/new',
        name: 'admin-product-new',
        component: () => import('../views/admin/ProductFormView.vue'),
      },
      {
        path: 'products/:id',
        name: 'admin-product-edit',
        component: () => import('../views/admin/ProductFormView.vue'),
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('../views/admin/CategoriesListView.vue'),
      },
      {
        path: 'cms',
        name: 'admin-cms',
        component: () => import('../views/admin/CmsListView.vue'),
      },
      {
        path: 'cms/new',
        name: 'admin-cms-new',
        component: () => import('../views/admin/CmsFormView.vue'),
      },
      {
        path: 'cms/:id',
        name: 'admin-cms-edit',
        component: () => import('../views/admin/CmsFormView.vue'),
      },
    ],
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/LoginView.vue'),
    meta: { requiresAdmin: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const requiresAdmin = to.matched.some((r) => r.meta?.requiresAdmin)
  const token = getAdminToken()
  if (requiresAdmin && to.path !== '/admin/login') {
    if (!token) {
      next('/admin/login')
      return
    }
  }
  if (to.path === '/admin/login' && token) {
    next('/admin/dashboard')
    return
  }
  next()
})

router.afterEach((to) => {
  const tracking = useTrackingStore()
  tracking.trackPageView(to.path, to.name as string)
})

export default router
