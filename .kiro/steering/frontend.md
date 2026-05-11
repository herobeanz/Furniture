---
inclusion: fileMatch
fileMatchPattern: "fe/**"
---

# Frontend Rules - Vue3 + TypeScript

## Tech Stack
- **Framework**: Vue3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Library**: Custom components + Tailwind CSS
- **TypeScript**: Strict mode
- **Testing**: Vitest + Vue Test Utils
- **Logging**: `src/utils/logger.ts` (DEV-only). ESLint `no-console` on (allow `warn/error`).

## Project Structure
```
fe/src/
├── pages/            # Route-level components (40+ pages)
│   ├── account/
│   ├── admin/
│   ├── organizer/
│   ├── events/
│   ├── tickets/
│   ├── marketplace/
│   ├── auctions/
│   ├── nft/
│   ├── collections/
│   ├── auth/
│   └── media/
├── components/       # Reusable components (30+)
│   ├── common/       # LoadingState, EmptyState, ErrorState, AsyncWrapper
│   ├── layout/       # AppHeader, AppFooter
│   └── [domain]/     # tickets/, marketplace/, auctions/, nft/, admin/, ...
├── layouts/          # Page layouts (admin/AdminLayout)
├── stores/           # Pinia stores (14 stores)
├── composables/      # useAsyncState, useToast, ...
├── types/            # TypeScript type definitions
├── utils/
│   └── logger.ts     # Centralized logging (use instead of console.log)
├── services/
│   ├── api/
│   │   ├── client.ts       # Axios instance + interceptors
│   │   ├── response.ts     # ApiEnvelope + unwrapResponseData
│   │   └── [domain].ts     # Typed API services
│   ├── firebase.ts
│   ├── wallet.ts
│   └── auctionSocket.ts
└── router/           # Vue Router (40+ routes)
```

## Component Rules

### Structure
```vue
<template>
  <div class="ticket-card">
    <h3>{{ ticket.name }}</h3>
    <p class="price">{{ formatPrice(ticket.price) }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Ticket } from '@/types/ticket'

interface Props {
  ticket: Ticket
  isEditable?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEditable: false,
  showActions: true,
})

const emit = defineEmits<{
  edit: [ticket: Ticket]
  delete: [id: string]
}>()
</script>

<style scoped>
.ticket-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow;
}
</style>
```

### Naming
- PascalCase for component names
- Prefix with domain: `TicketCard`, `EventForm`, `AuctionBidModal`
- Pages suffix: `EventsPage`, `EventDetailPage`

## Store Rules (Pinia)

```typescript
// stores/tickets.ts
export const useTicketStore = defineStore('tickets', () => {
  // State
  const tickets = ref<Ticket[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeTickets = computed(() =>
    tickets.value.filter(t => t.status === 'ACTIVE')
  )

  // Actions
  const fetchTickets = async (query?: TicketQueryDto) => {
    try {
      isLoading.value = true
      error.value = null
      tickets.value = await ticketApi.getTickets(query)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tickets'
      toast.error('Không thể tải danh sách vé')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { tickets, isLoading, error, activeTickets, fetchTickets }
})
```

- Use `use` prefix: `useTicketStore`, `useAuthStore`
- Keep stores focused on single domain
- Always reset `error` at start of actions, set in catch

## Composables Rules

```typescript
// composables/usePriceFormatter.ts
export function usePriceFormatter() {
  const formatPrice = (price: number, currency = 'VND') =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency, minimumFractionDigits: 0 }).format(price)

  return { formatPrice }
}
```

- Use `use` prefix, focused and reusable
- Prefer `useAsyncState` for async data fetching in components

## Service Rules

### API Service Pattern
```typescript
// services/api/tickets.ts
import apiClient from './client'
import { unwrapResponseData } from './response'

export const ticketApi = {
  async getTickets(query?: TicketQueryDto): Promise<Ticket[]> {
    const response = await apiClient.get('/tickets', { params: query })
    return unwrapResponseData<Ticket[]>(response)
  },

  async getTicketById(id: string): Promise<Ticket> {
    const response = await apiClient.get(`/tickets/${id}`)
    return unwrapResponseData<Ticket>(response)
  },
}
```

### API Client
```typescript
// services/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
})

// Request: attach Bearer token from authStore
// Response: on 401 → authStore.logout() + emit 'auth:unauthorized'
```

- Export as plain object with methods (not class)
- Always use `unwrapResponseData()` for `{ success, data, message }` responses
- Handle 401 gracefully (fallback or logout)

## TypeScript Rules

```typescript
// types/ticket.ts
export interface Ticket {
  id: string
  eventId: string
  name: string
  price: number
  type: TicketType
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
  event?: Event
  owner?: User
}

export type TicketType = 'VIP' | 'REGULAR' | 'EARLY_BIRD'
export type TicketStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

- PascalCase for interfaces/types
- Group related types in same file
- Use generics for reusable patterns

## Router Rules

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/events/:id',
    name: 'EventDetail',
    component: () => import('@/pages/events/EventDetailPage.vue'), // always lazy
    props: true,
  },
  {
    path: '/account',
    meta: { requiresAuth: true },
    children: [...],
  },
  {
    path: '/admin',
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

// Guards: requiresAuth, requiresAdmin, requiresOrganizer, requiresGuest
```

- Always use dynamic imports for route components
- Use `meta` for auth requirements, check in `router.beforeEach`

## Styling Rules

- Mobile-first Tailwind: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Always support dark mode: `bg-white dark:bg-gray-800 text-gray-900 dark:text-white`
- Use `@apply` in `<style scoped>` for repeated utility groups

## Logging

```typescript
import { logger } from '@/utils/logger'

logger.debug('DEV-only noisy log')   // stripped in prod
logger.error('Something failed', err)
// No console.log — ESLint will warn
// console.warn/error only when truly needed
```

## Error Handling

### In Components (preferred)
```vue
<script setup lang="ts">
import { useAsyncState } from '@/composables/useAsyncState'
import { ticketApi } from '@/services/api/tickets'

const { data, isLoading, error } = useAsyncState(
  () => ticketApi.getTickets(),
  { immediate: true }
)
</script>

<template>
  <AsyncWrapper :loading="isLoading" :error="error">
    <div v-if="data?.length"><!-- content --></div>
    <EmptyState v-else message="Không có dữ liệu" />
  </AsyncWrapper>
</template>
```

### In Stores
```typescript
catch (error: any) {
  const status = error?.response?.status
  if (status === 401) { authStore.logout() }
  else if (status === 403) { toast.error('Không có quyền') }
  else if (status === 404) { toast.error('Không tìm thấy') }
  else { toast.error(error?.response?.data?.message || 'Lỗi không xác định') }
  throw error
}
```

## Common Patterns

### Page Structure
```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">{{ title }}</h1>
    <AsyncWrapper :loading="isLoading" :error="error">
      <div v-if="data?.length"><!-- content --></div>
      <EmptyState v-else message="Không có dữ liệu" />
    </AsyncWrapper>
  </div>
</template>
```

### Accessibility
```vue
<button :aria-label="`Edit ${item.name}`" @click="handleEdit">
  <EditIcon />
</button>

<div tabindex="0" @keydown.enter="handleClick" @keydown.space="handleClick">
  <!-- focusable non-button -->
</div>
```

## Quick Reference

| Pattern | Convention |
|---|---|
| Component file | `TicketCard.vue` (PascalCase) |
| Store | `useTicketStore` → `defineStore('tickets', () => {})` |
| API service | `ticketApi` object + `unwrapResponseData()` |
| Async in component | `useAsyncState` + `AsyncWrapper` |
| Logging | `logger.debug/error` from `@/utils/logger` |
| Dark mode | Always add `dark:` variants |
| Route components | Always lazy: `() => import(...)` |

### Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run type-check   # TypeScript check
npm run lint         # ESLint
```
