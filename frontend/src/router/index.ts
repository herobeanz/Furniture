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
  // Static routes - must be before dynamic routes
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
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
  },
  {
    path: '/lien-he',
    name: 'contact',
    component: () => import('../views/ContactView.vue'),
  },
  // Redirect old /contact to /lien-he
  {
    path: '/contact',
    redirect: '/lien-he',
  },
  // Inquiry Form: /san-pham/:slug/lien-he
  {
    path: '/san-pham/:slug/lien-he',
    name: 'product-inquiry',
    component: () => import('../views/ContactView.vue'),
  },
  // Collection: /bo-suu-tap/...
  {
    path: '/bo-suu-tap/:slug',
    name: 'collection',
    component: () => import('../views/CategoryView.vue'),
  },
  // CMS Page: /trang/...
  {
    path: '/trang/:slug',
    name: 'cms-page',
    component: () => import('../views/CmsPageView.vue'),
  },
  // Product: /phongngu/giuong/giuong-ngu-... (must be before category)
  {
    path: '/:roomSlug/:categorySlug/:productSlug',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
  },
  // Category: /phongngu/giuong
  {
    path: '/:roomSlug/:categorySlug',
    name: 'category',
    component: () => import('../views/CategoryView.vue'),
  },
  // Room: /phongngu (must be last to catch all room slugs)
  {
    path: '/:roomSlug',
    name: 'room',
    component: () => import('../views/CategoryView.vue'),
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
        path: 'rooms',
        name: 'admin-rooms',
        component: () => import('../views/admin/RoomsListView.vue'),
      },
      {
        path: 'rooms/new',
        name: 'admin-room-new',
        component: () => import('../views/admin/RoomFormView.vue'),
      },
      {
        path: 'rooms/:id',
        name: 'admin-room-edit',
        component: () => import('../views/admin/RoomFormView.vue'),
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('../views/admin/CategoriesListView.vue'),
      },
      {
        path: 'categories/new',
        name: 'admin-category-new',
        component: () => import('../views/admin/CategoryFormView.vue'),
      },
      {
        path: 'categories/:id',
        name: 'admin-category-edit',
        component: () => import('../views/admin/CategoryFormView.vue'),
      },
      {
        path: 'collections',
        name: 'admin-collections',
        component: () => import('../views/admin/CollectionsListView.vue'),
      },
      {
        path: 'collections/new',
        name: 'admin-collection-new',
        component: () => import('../views/admin/CollectionFormView.vue'),
      },
      {
        path: 'collections/:id',
        name: 'admin-collection-edit',
        component: () => import('../views/admin/CollectionFormView.vue'),
      },
      {
        path: 'cms-pages',
        name: 'admin-cms-pages',
        component: () => import('../views/admin/CmsListView.vue'),
      },
      {
        path: 'cms-pages/new',
        name: 'admin-cms-page-new',
        component: () => import('../views/admin/CmsFormView.vue'),
      },
      {
        path: 'cms-pages/:id',
        name: 'admin-cms-page-edit',
        component: () => import('../views/admin/CmsFormView.vue'),
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('../views/admin/ReportsView.vue'),
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
