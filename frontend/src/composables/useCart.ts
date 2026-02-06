import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from './useToast'
import type { CartItem } from '@/stores/cart'

export function useCart() {
  const cartStore = useCartStore()
  const { toast } = useToast()

  const items = computed(() => cartStore.items)
  const totalItems = computed(() => cartStore.totalItems)
  const totalPrice = computed(() => cartStore.totalPrice)

  function addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
    cartStore.addItem({
      ...item,
      quantity: item.quantity ?? 1,
    })
    toast.success('Đã thêm vào giỏ hàng', `${item.name}${item.quantity && item.quantity > 1 ? ` x${item.quantity}` : ''}`)
  }

  function removeItem(id: string) {
    const item = cartStore.items.find((i) => i.id === id)
    cartStore.removeItem(id)
    if (item) {
      toast.success('Đã xóa khỏi giỏ hàng', item.name)
    }
  }

  function updateQuantity(id: string, quantity: number) {
    const item = cartStore.items.find((i) => i.id === id)
    cartStore.updateQuantity(id, quantity)
    if (item) {
      toast.success('Đã cập nhật số lượng', `${item.name} x${quantity}`)
    }
  }

  function clearCart() {
    cartStore.clearCart()
    toast.success('Đã xóa toàn bộ giỏ hàng')
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
