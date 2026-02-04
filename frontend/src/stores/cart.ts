import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  function addItem(item: CartItem) {
    const existingItem = items.value.find((i) => i.id === item.id)
    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      items.value.push({ ...item })
    }
    saveToLocalStorage()
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id)
    saveToLocalStorage()
  }

  function updateQuantity(id: string, quantity: number) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      item.quantity = quantity
      if (item.quantity <= 0) {
        removeItem(id)
      } else {
        saveToLocalStorage()
      }
    }
  }

  function clearCart() {
    items.value = []
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('furniture-cart', JSON.stringify(items.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('furniture-cart')
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch (error) {
        console.error('Failed to load cart from localStorage', error)
      }
    }
  }

  // Load cart on initialization
  loadFromLocalStorage()

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
