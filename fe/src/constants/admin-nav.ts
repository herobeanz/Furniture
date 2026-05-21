export interface AdminNavItem {
  to: string;
  label: string;
  icon: string;
  match?: (path: string) => boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: "fa-solid fa-chart-pie",
    match: (path) => path === "/admin/dashboard",
  },
  {
    to: "/admin/inquiries",
    label: "Quản lý yêu cầu",
    icon: "fa-regular fa-clipboard",
    match: (path) => path.startsWith("/admin/inquiries"),
  },
  {
    to: "/admin/products",
    label: "Quản lý sản phẩm",
    icon: "fa-solid fa-box-open",
    match: (path) =>
      path.startsWith("/admin/products") ||
      path.startsWith("/admin/categories"),
  },
  {
    to: "/admin/collections",
    label: "Quản lý bộ sưu tập",
    icon: "fa-solid fa-layer-group",
    match: (path) => path.startsWith("/admin/collections"),
  },
  {
    to: "/admin/blog",
    label: "Quản lý Blog",
    icon: "fa-regular fa-newspaper",
    match: (path) => path.startsWith("/admin/blog"),
  },
];

export const ADMIN_CATEGORY_CHART_COLORS = [
  "#5c3c24",
  "#8c6242",
  "#b89474",
  "#dcc9b4",
  "#a3b19b",
  "#d0d6cb",
] as const;
