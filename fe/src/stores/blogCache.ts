import { defineStore } from 'pinia'
import { blogApi, type BlogPost } from '@/services/api/blog'
import { isCacheFresh, type TimedEntry } from '@/utils/cacheEntry'

function postsCacheKey(featured?: boolean): string {
  return featured ? 'featured' : 'all'
}

export const useBlogCacheStore = defineStore('blogCache', () => {
  const postsCache = new Map<string, TimedEntry<BlogPost[]>>()
  const postCache = new Map<string, TimedEntry<BlogPost>>()

  function peekPosts(featured?: boolean): BlogPost[] | undefined {
    return postsCache.get(postsCacheKey(featured))?.data
  }

  function isPostsFresh(featured?: boolean): boolean {
    const entry = postsCache.get(postsCacheKey(featured))
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchPosts(
    featured?: boolean,
    options?: { force?: boolean },
  ): Promise<BlogPost[]> {
    const key = postsCacheKey(featured)
    const hit = postsCache.get(key)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }
    const data = await blogApi.getPosts(featured)
    postsCache.set(key, { data, fetchedAt: Date.now() })
    return data
  }

  function peekPost(slug: string): BlogPost | undefined {
    return postCache.get(slug)?.data
  }

  function isPostFresh(slug: string): boolean {
    const entry = postCache.get(slug)
    return !!entry && isCacheFresh(entry.fetchedAt)
  }

  async function fetchPost(
    slug: string,
    options?: { force?: boolean },
  ): Promise<BlogPost> {
    const hit = postCache.get(slug)
    if (hit && isCacheFresh(hit.fetchedAt) && !options?.force) {
      return hit.data
    }
    const data = await blogApi.getPost(slug)
    postCache.set(slug, { data, fetchedAt: Date.now() })
    return data
  }

  function invalidateAll(): void {
    postsCache.clear()
    postCache.clear()
  }

  return {
    peekPosts,
    isPostsFresh,
    fetchPosts,
    peekPost,
    isPostFresh,
    fetchPost,
    invalidateAll,
  }
})
