import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useTrackingStore } from "@/stores/tracking";
import { useRouterLoadingStore } from "@/stores/routerLoading";
import { getAdminToken } from "@/services/api/client";
import { logger } from "@/utils/logger";
import {
  PRIVACY_POLICY_PAGE,
  TERMS_PAGE,
  SHIPPING_POLICY_PAGE,
  WOOD_CARE_GUIDE_PAGE,
} from "@/constants/static-content-pages";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/blog",
    name: "blog",
    component: () => import("../views/BlogView.vue"),
  },
  {
    path: "/blog/:slug/preview",
    name: "blog-post-preview",
    component: () => import("../layouts/PreviewLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/BlogPostView.vue"),
      },
    ],
  },
  {
    path: "/blog/:slug",
    name: "blog-post",
    component: () => import("../views/BlogPostView.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../views/SearchView.vue"),
  },
  {
    path: "/contact",
    redirect: "/lien-he",
  },
  // Collection listing + detail
  {
    path: "/bo-suu-tap",
    name: "collections",
    component: () => import("../views/CollectionsListView.vue"),
  },
  {
    path: "/bo-suu-tap/:slug/preview",
    name: "collection-preview",
    component: () => import("../layouts/PreviewLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/CollectionView.vue"),
      },
    ],
  },
  {
    path: "/bo-suu-tap/:slug",
    name: "collection",
    component: () => import("../views/CollectionView.vue"),
  },
  {
    path: "/san-pham",
    name: "products",
    component: () => import("../views/ProductsListView.vue"),
  },
  {
    path: "/san-pham/:categorySlug/:productSlug/preview",
    name: "product-preview",
    component: () => import("../layouts/PreviewLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/ProductView.vue"),
      },
    ],
  },
  {
    path: "/san-pham/:categorySlug/:productSlug",
    name: "product",
    component: () => import("../views/ProductView.vue"),
  },
  {
    path: "/san-pham/:categorySlug/preview",
    name: "category-preview",
    component: () => import("../layouts/PreviewLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/CategoryView.vue"),
      },
    ],
  },
  {
    path: "/san-pham/:categorySlug",
    name: "category",
    component: () => import("../views/CategoryView.vue"),
  },
  // Product preview (legacy single slug — sau category để tránh nuốt /:slug/preview)
  {
    path: "/san-pham/:productSlug/preview",
    name: "product-preview-legacy",
    component: () => import("../layouts/PreviewLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("../views/ProductView.vue"),
      },
    ],
  },
  // Redirect URL phòng cũ → bộ sưu tập / sản phẩm mới
  {
    path: "/phong-khach",
    redirect: "/bo-suu-tap/phong-khach",
  },
  {
    path: "/phong-ngu",
    redirect: "/bo-suu-tap/phong-ngu",
  },
  {
    path: "/phong-bep",
    redirect: "/bo-suu-tap/phong-bep",
  },
  {
    path: "/phong-tho",
    redirect: "/bo-suu-tap/phong-tho",
  },
  {
    path: "/phong-khach/:categorySlug/:productSlug",
    redirect: (to) => ({
      path: `/san-pham/${to.params.categorySlug}/${to.params.productSlug}`,
    }),
  },
  {
    path: "/phong-ngu/:categorySlug/:productSlug",
    redirect: (to) => ({
      path: `/san-pham/${to.params.categorySlug}/${to.params.productSlug}`,
    }),
  },
  {
    path: "/phong-bep/:categorySlug/:productSlug",
    redirect: (to) => ({
      path: `/san-pham/${to.params.categorySlug}/${to.params.productSlug}`,
    }),
  },
  {
    path: "/phong-tho/:categorySlug/:productSlug",
    redirect: (to) => ({
      path: `/san-pham/${to.params.categorySlug}/${to.params.productSlug}`,
    }),
  },
  {
    path: "/phong-khach/:categorySlug",
    redirect: (to) => ({ path: `/san-pham/${to.params.categorySlug}` }),
  },
  {
    path: "/phong-ngu/:categorySlug",
    redirect: (to) => ({ path: `/san-pham/${to.params.categorySlug}` }),
  },
  {
    path: "/phong-bep/:categorySlug",
    redirect: (to) => ({ path: `/san-pham/${to.params.categorySlug}` }),
  },
  {
    path: "/phong-tho/:categorySlug",
    redirect: (to) => ({ path: `/san-pham/${to.params.categorySlug}` }),
  },
  {
    path: "/admin",
    component: () => import("../layouts/AdminLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: () => import("../views/admin/DashboardView.vue"),
      },
      {
        path: "inquiries",
        name: "admin-inquiries",
        component: () => import("../views/admin/InquiriesListView.vue"),
      },
      {
        path: "products",
        component: () => import("../views/admin/ProductsManageView.vue"),
        children: [
          {
            path: "",
            name: "admin-products-categories",
            component: () => import("../views/admin/CategoriesListView.vue"),
          },
          {
            path: "list",
            name: "admin-products-list",
            component: () => import("../views/admin/ProductsListView.vue"),
          },
        ],
      },
      {
        path: "products/new",
        name: "admin-product-new",
        component: () => import("../views/admin/ProductFormView.vue"),
      },
      {
        path: "products/:id(\\d+)",
        name: "admin-product-edit",
        component: () => import("../views/admin/ProductFormView.vue"),
      },
      {
        path: "categories",
        name: "admin-categories",
        redirect: "/admin/products",
      },
      {
        path: "categories/new",
        name: "admin-category-new",
        component: () => import("../views/admin/CategoryFormView.vue"),
      },
      {
        path: "categories/:id(\\d+)",
        name: "admin-category-edit",
        component: () => import("../views/admin/CategoryFormView.vue"),
      },
      {
        path: "collections",
        name: "admin-collections",
        component: () => import("../views/admin/CollectionsListView.vue"),
      },
      {
        path: "collections/new",
        name: "admin-collection-new",
        component: () => import("../views/admin/CollectionFormView.vue"),
      },
      {
        path: "collections/:id(\\d+)",
        name: "admin-collection-edit",
        component: () => import("../views/admin/CollectionFormView.vue"),
      },
      {
        path: "account",
        name: "admin-account",
        component: () => import("../views/admin/AccountInfoView.vue"),
      },
      {
        path: "blog",
        name: "admin-blog",
        component: () => import("../views/admin/BlogListView.vue"),
      },
      {
        path: "blog/new",
        name: "admin-blog-new",
        component: () => import("../views/admin/BlogFormView.vue"),
      },
      {
        path: "blog/:id(\\d+)",
        name: "admin-blog-edit",
        component: () => import("../views/admin/BlogFormView.vue"),
      },
    ],
  },
  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("../views/admin/LoginView.vue"),
    meta: { requiresAdmin: false },
  },
  {
    path: "/ve-chung-toi",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/lien-he",
    name: "contact",
    component: () => import("../views/ContactView.vue"),
  },
  {
    path: "/chinh-sach-bao-hanh",
    name: "warranty-policy",
    component: () => import("../views/WarrantyPolicyView.vue"),
  },
  {
    path: "/chinh-sach-doi-tra",
    name: "return-exchange-policy",
    component: () => import("../views/ReturnExchangePolicyView.vue"),
  },
  {
    path: "/huong-dan-mua-hang",
    name: "purchase-guide",
    component: () => import("../views/PurchaseGuideView.vue"),
  },
  {
    path: "/privacy-policy",
    name: "privacy-policy",
    component: () => import("../views/SimpleContentPageView.vue"),
    props: { page: PRIVACY_POLICY_PAGE },
  },
  {
    path: "/terms",
    name: "terms",
    component: () => import("../views/SimpleContentPageView.vue"),
    props: { page: TERMS_PAGE },
  },
  {
    path: "/chinh-sach-van-chuyen",
    name: "shipping-policy",
    component: () => import("../views/SimpleContentPageView.vue"),
    props: { page: SHIPPING_POLICY_PAGE },
  },
  {
    path: "/huong-dan-bao-quan-go",
    name: "wood-care-guide",
    component: () => import("../views/SimpleContentPageView.vue"),
    props: { page: WOOD_CARE_GUIDE_PAGE },
  },
  {
    path: "/page/gioi-thieu",
    redirect: "/ve-chung-toi",
  },
  {
    path: "/page/about",
    redirect: "/ve-chung-toi",
  },
  {
    path: "/gioi-thieu",
    redirect: "/ve-chung-toi",
  },
  {
    path: "/page/:slug",
    redirect: (to) => ({ path: `/${String(to.params.slug)}` }),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Luôn scroll lên đầu trang khi chuyển route (trừ khi quay lại/tiến tới có savedPosition)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }

    // Chỉ đổi query (vd. ?category= trên /san-pham) — giữ vị trí cuộn hiện tại
    if (to.path === from.path) {
      return false;
    }

    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const routerLoading = useRouterLoadingStore();

  // Start loading indicator (except for same route or admin routes)
  if (to.path !== from.path && !to.path.startsWith("/admin")) {
    routerLoading.start();
  }

  const requiresAdmin = to.matched.some((r) => r.meta?.requiresAdmin);
  const token = getAdminToken();
  if (requiresAdmin && to.path !== "/admin/login") {
    if (!token) {
      routerLoading.stop();
      next("/admin/login");
      return;
    }
  }
  if (to.path === "/admin/login" && token) {
    routerLoading.stop();
    next("/admin/dashboard");
    return;
  }
  next();
});

router.afterEach((to, from) => {
  const tracking = useTrackingStore();
  const routerLoading = useRouterLoadingStore();

  tracking.trackPageView(to.path, to.name as string);

  // Store route depth for transition animations
  const depth = to.path.split("/").filter(Boolean).length;
  to.meta.prevDepth = from.path.split("/").filter(Boolean).length;
  to.meta.depth = depth;

  // Stop loading indicator after a small delay for smooth transition
  setTimeout(() => {
    routerLoading.stop();
  }, 100);
});

router.onError((error) => {
  const routerLoading = useRouterLoadingStore();
  routerLoading.stop();
  logger.error("Router error:", error);
});

export default router;
