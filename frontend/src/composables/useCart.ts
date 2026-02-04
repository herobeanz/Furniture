import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { CartItem } from '@/stores/cart'

export function useCart() {
  const cartStore = useCartStore()

  const items = computed(() => cartStore.items)
  const totalItems = computed(() => cartStore.totalItems)
  const totalPrice = computed(() => cartStore.totalPrice)

  function addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
    cartStore.addItem({
      ...item,
      quantity: item.quantity ?? 1,
    })
  }

  function removeItem(id: string) {
    cartStore.removeItem(id)
  }

  function updateQuantity(id: string, quantity: number) {
    cartStore.updateQuantity(id, quantity)
  }

  function clearCart() {
    cartStore.clearCart()
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
