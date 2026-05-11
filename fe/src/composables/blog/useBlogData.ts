import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { blogApi, type BlogPost } from '@/services/api/blog'
import { extractErrorMessage } from '@/utils/error'
import { getPreviewData } from '@/utils/preview'
import { logger } from '@/utils/logger'

/**
 * Composable for Blog listing page data fetching
 */
export function useBlogListData() {
  const posts = ref<BlogPost[]>([])
  const loading = ref(true)
  const error = ref('')

  async function fetchPosts() {
    loading.value = true
    error.value = ''
    try {
      posts.value = await blogApi.getPosts()
    } catch (e: any) {
      error.value = extractErrorMessage(e, 'Không thể tải bài viết.')
      logger.error('Failed to fetch blog posts:', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPosts()
  })

  return {
    posts,
    loading,
    error,
  }
}

/**
 * Composable for Blog post detail page data fetching
 */
export function useBlogPostData() {
  const route = useRoute()
  const slug = computed(() => route.params.slug as string)
  const isPreview = computed(() => route.name === 'blog-post-preview')

  const post = ref<BlogPost | null>(null)
  const loading = ref(true)
  const error = ref('')

  async function fetchPost() {
    if (!slug.value) return
    
    // Check for preview data first
    if (isPreview.value) {
      const previewData = getPreviewData('blog', slug.value)
      if (previewData) {
        post.value = previewData as BlogPost
        loading.value = false
        return
      }
    }
    
    loading.value = true
    error.value = ''
    try {
      post.value = await blogApi.getPost(slug.value)
    } catch (e: any) {
      error.value = extractErrorMessage(e, 'Không tìm thấy bài viết.')
      logger.error('Failed to fetch blog post:', e)
    } finally {
      loading.value = false
    }
  }

  watch(slug, fetchPost, { immediate: true })

  return {
    post,
    loading,
    error,
  }
}
