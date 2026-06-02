import { defineStore } from 'pinia'
import {
  productApi,
  type Product,
  type ProductListResponse,
  type ProductQueryParams,
} from '@/services/api/products'
import { categoryApi } from '@/services/api/categories'
import { isCacheFresh, type TimedEntry } from '@/utils/cacheEntry'

export const RELATED_PRODUCTS_LIMIT = 6

function listCacheKey(params?: ProductQueryParams): string {
  const p = params ?? {}
  return JSON.stringify({
    page: p.page ?? 1,
    limit: p.limit ?? 20,
    category: p.category ?? '',
    search: p.search ?? '',
    sort: p.sort ?? '',
    order: p.order ?? '',
  })
}

function categoryListCacheKey(
  slug: string,
  params?: Record<string, unknown>,
): string {
  return `cat:${slug}:${JSON.stringify(params ?? {})}`
}

export const useProductsCacheStore = defineStore('productsCache', () => {
  const listCache = new Map<string, TimedEntry<ProductListResponse>>()
  const productCache = new Map<string, TimedEntry<Product>>()
  const relatedCache = new Map<string, TimedEntry<Product[]>>()
  const categoryListCache = new Map<
    string,
    TimedEntry<{ data: Product[]; total: number }>
  >()

  function peekList(
    params?: ProductQueryParams,
  ): ProductListResponse | undefined {
    return listCache.get(listCacheKey(params))?.data
  }

  function isListFresh(params?: ProductQueryParams): boolean {
    const entry = listCache.get(listCacheKey(params))
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchList(
    params?: ProductQueryParams,
    options?: { force?: boolean },
  ): Promise<ProductListResponse> {
    const key = listCacheKey(params)
    const hit = listCache.get(key)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }
    const data = await productApi.getProducts(params)
    listCache.set(key, { data, fetchedAt: Date.now() })
    return data
  }

  function peekProduct(slug: string): Product | undefined {
    return productCache.get(slug)?.data
  }

  function isProductFresh(slug: string): boolean {
    const entry = productCache.get(slug)
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchProduct(
    slug: string,
    options?: { force?: boolean },
  ): Promise<Product> {
    const hit = productCache.get(slug)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }
    const data = await productApi.getProduct(slug)
    productCache.set(slug, { data, fetchedAt: Date.now() })
    return data
  }

  function peekRelated(slug: string, limit = RELATED_PRODUCTS_LIMIT): Product[] | undefined {
    return relatedCache.get(`${slug}:${limit}`)?.data
  }

  function isRelatedFresh(slug: string, limit = RELATED_PRODUCTS_LIMIT): boolean {
    const entry = relatedCache.get(`${slug}:${limit}`)
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchRelated(
    slug: string,
    limit = RELATED_PRODUCTS_LIMIT,
    options?: { force?: boolean },
  ): Promise<Product[]> {
    const key = `${slug}:${limit}`
    const hit = relatedCache.get(key)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }
    const data = await productApi.getRelatedProducts(slug, limit)
    relatedCache.set(key, { data, fetchedAt: Date.now() })
    return data
  }

  function peekCategoryList(
    slug: string,
    params?: Record<string, unknown>,
  ): { data: Product[]; total: number } | undefined {
    return categoryListCache.get(categoryListCacheKey(slug, params))?.data
  }

  function isCategoryListFresh(
    slug: string,
    params?: Record<string, unknown>,
  ): boolean {
    const entry = categoryListCache.get(categoryListCacheKey(slug, params))
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchCategoryList(
    slug: string,
    params?: Record<string, unknown>,
    options?: { force?: boolean },
  ): Promise<{ data: Product[]; total: number }> {
    const key = categoryListCacheKey(slug, params)
    const hit = categoryListCache.get(key)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }
    const res = await categoryApi.getCategoryProducts(slug, params)
    const data = {
      data: (res.data ?? []) as Product[],
      total: res.total ?? 0,
    }
    categoryListCache.set(key, { data, fetchedAt: Date.now() })
    return data
  }

  function invalidateAll(): void {
    listCache.clear()
    productCache.clear()
    relatedCache.clear()
    categoryListCache.clear()
  }

  return {
    peekList,
    isListFresh,
    fetchList,
    peekProduct,
    isProductFresh,
    fetchProduct,
    peekRelated,
    isRelatedFresh,
    fetchRelated,
    peekCategoryList,
    isCategoryListFresh,
    fetchCategoryList,
    invalidateAll,
  }
})
