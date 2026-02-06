import { computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useToast } from './useToast'
import type { WishlistItem } from '@/stores/wishlist'

export function useWishlist() {
  const wishlistStore = useWishlistStore()
  const { toast } = useToast()

  const items = computed(() => wishlistStore.items)
  const itemIds = computed(() => wishlistStore.itemIds)

  function toggleItem(item: WishlistItem) {
    const isInWishlist = wishlistStore.isInWishlist(item.id)
    wishlistStore.toggleItem(item)
    if (isInWishlist) {
      toast.success('Đã xóa khỏi yêu thích', item.name)
    } else {
      toast.success('Đã thêm vào yêu thích', item.name)
    }
  }

  function isInWishlist(id: string): boolean {
    return wishlistStore.isInWishlist(id)
  }

  function removeItem(id: string) {
    const item = wishlistStore.items.find((i) => i.id === id)
    wishlistStore.removeItem(id)
    if (item) {
      toast.success('Đã xóa khỏi yêu thích', item.name)
    }
  }

  function clearWishlist() {
    wishlistStore.clearWishlist()
    toast.success('Đã xóa toàn bộ yêu thích')
  }

  return {
    items,
    itemIds,
    toggleItem,
    isInWishlist,
    removeItem,
    clearWishlist,
  }
}
