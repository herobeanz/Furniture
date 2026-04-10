import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useTrackingStore } from '@/stores/tracking'
import { useRouterLoadingStore } from '@/stores/routerLoading'
import { getAdminToken } from '@/services/api.client'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
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
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchView.vue'),
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
        component: () => import('../views/RoomView.vue'),
      },
    ],
  },
  // Room: /phongngu (must be last to catch all room slugs)
  {
    path: '/:roomSlug',
    name: 'room',
    component: () => import('../views/RoomView.vue'),
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
        path: 'products/import',
        name: 'admin-products-import',
        component: () => import('../views/admin/ProductBulkImportView.vue'),
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
        path: 'account',
        name: 'admin-account',
        component: () => import('../views/admin/AccountInfoView.vue'),
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
  // Luôn scroll lên đầu trang khi chuyển route (trừ khi quay lại/tiến tới có savedPosition)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const routerLoading = useRouterLoadingStore()
  
  // Start loading indicator (except for same route or admin routes)
  if (to.path !== from.path && !to.path.startsWith('/admin')) {
    routerLoading.start()
  }

  const requiresAdmin = to.matched.some((r) => r.meta?.requiresAdmin)
  const token = getAdminToken()
  if (requiresAdmin && to.path !== '/admin/login') {
    if (!token) {
      routerLoading.stop()
      next('/admin/login')
      return
    }
  }
  if (to.path === '/admin/login' && token) {
    routerLoading.stop()
    next('/admin/dashboard')
    return
  }
  next()
})

router.afterEach((to, from) => {
  const tracking = useTrackingStore()
  const routerLoading = useRouterLoadingStore()
  
  tracking.trackPageView(to.path, to.name as string)
  
  // Store route depth for transition animations
  const depth = to.path.split('/').filter(Boolean).length
  to.meta.prevDepth = from.path.split('/').filter(Boolean).length
  to.meta.depth = depth
  
  // Stop loading indicator after a small delay for smooth transition
  setTimeout(() => {
    routerLoading.stop()
  }, 100)
})

router.onError((error) => {
  const routerLoading = useRouterLoadingStore()
  routerLoading.stop()
  console.error('Router error:', error)
})

export default router
