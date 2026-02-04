import { computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import type { WishlistItem } from '@/stores/wishlist'

export function useWishlist() {
  const wishlistStore = useWishlistStore()

  const items = computed(() => wishlistStore.items)
  const itemIds = computed(() => wishlistStore.itemIds)

  function toggleItem(item: WishlistItem) {
    wishlistStore.toggleItem(item)
  }

  function isInWishlist(id: string): boolean {
    return wishlistStore.isInWishlist(id)
  }

  function removeItem(id: string) {
    wishlistStore.removeItem(id)
  }

  function clearWishlist() {
    wishlistStore.clearWishlist()
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
