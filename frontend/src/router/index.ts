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
    path: '/blog/:slug/preview',
    name: 'blog-post-preview',
    component: () => import('../layouts/PreviewLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/BlogPostView.vue'),
      },
    ],
  },
  {
    path: '/blog/:slug',
    name: 'blog-post',
    component: () => import('../views/BlogPostView.vue'),
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
  },
  // Redirect old /contact and /lien-he to /page/lien-he
  {
    path: '/contact',
    redirect: '/page/lien-he',
  },
  {
    path: '/lien-he',
    redirect: '/page/lien-he',
  },
  // Collection: /bo-suu-tap/...
  {
    path: '/bo-suu-tap/:slug/preview',
    name: 'collection-preview',
    component: () => import('../layouts/PreviewLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/CollectionView.vue'),
      },
    ],
  },
  {
    path: '/bo-suu-tap/:slug',
    name: 'collection',
    component: () => import('../views/CollectionView.vue'),
  },
  // CMS Page: /page/about, /page/privacy, etc.
  {
    path: '/page/:slug/preview',
    name: 'cms-page-preview',
    component: () => import('../layouts/PreviewLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/CmsPageView.vue'),
      },
    ],
  },
  {
    path: '/page/:slug',
    name: 'cms-page',
    component: () => import('../views/CmsPageView.vue'),
  },
  // Product preview: /san-pham/.../preview
  {
    path: '/san-pham/:productSlug/preview',
    name: 'product-preview',
    component: () => import('../layouts/PreviewLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/ProductView.vue'),
      },
    ],
  },
  // Product: /phongngu/giuong/giuong-ngu-... (must be before category)
  {
    path: '/:roomSlug/:categorySlug/:productSlug',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
  },
  // Category preview: /phongngu/giuong/preview
  {
    path: '/:roomSlug/:categorySlug/preview',
    name: 'category-preview',
    component: () => import('../layouts/PreviewLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/CategoryView.vue'),
      },
    ],
  },
  // Category: /phongngu/giuong
  {
    path: '/:roomSlug/:categorySlug',
    name: 'category',
    component: () => import('../views/CategoryView.vue'),
  },
  // Room preview: /phongngu/preview
  {
    path: '/:roomSlug/preview',
    name: 'room-preview',
    component: () => import('../layouts/PreviewLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/CategoryView.vue'),
      },
    ],
  },
  // Room: /phongngu (must be last to catch all room slugs)
  {
    path: '/:roomSlug',
    name: 'room',
    component: () => import('../views/CategoryView.vue'),
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
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
      {
        path: 'blog',
        name: 'admin-blog',
        component: () => import('../views/admin/BlogListView.vue'),
      },
      {
        path: 'blog/new',
        name: 'admin-blog-new',
        component: () => import('../views/admin/BlogFormView.vue'),
      },
      {
        path: 'blog/:id',
        name: 'admin-blog-edit',
        component: () => import('../views/admin/BlogFormView.vue'),
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
