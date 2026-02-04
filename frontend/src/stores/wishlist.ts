import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface WishlistItem {
  id: string
  name: string
  price: number
  image?: string
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])

  const itemIds = computed(() => {
    return items.value.map((item) => item.id)
  })

  function toggleItem(item: WishlistItem) {
    const index = items.value.findIndex((i) => i.id === item.id)
    if (index > -1) {
      items.value.splice(index, 1)
    } else {
      items.value.push({ ...item })
    }
    saveToLocalStorage()
  }

  function isInWishlist(id: string): boolean {
    return items.value.some((item) => item.id === id)
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
    saveToLocalStorage()
  }

  function clearWishlist() {
    items.value = []
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('furniture-wishlist', JSON.stringify(items.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('furniture-wishlist')
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch (error) {
        console.error('Failed to load wishlist from localStorage', error)
      }
    }
  }

  // Load wishlist on initialization
  loadFromLocalStorage()

  return {
    items,
    itemIds,
    toggleItem,
    isInWishlist,
    removeItem,
    clearWishlist,
  }
})
