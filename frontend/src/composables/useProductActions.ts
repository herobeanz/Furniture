import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useToast } from './useToast'
import type { Product } from '../services/product.service'
import type { WishlistItem } from '../stores/wishlist'

/**
 * Composable for product actions (add to cart, wishlist)
 */
export function useProductActions() {
  const cartStore = useCartStore()
  const wishlistStore = useWishlistStore()
  const { toast } = useToast()

  function addToCart(product: Product | WishlistItem) {
    const productImage = 'images' in product 
      ? (product as Product).images?.[0] || (product as Product).thumbnail
      : (product as WishlistItem).image
    cartStore.addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: productImage,
      slug: product.slug,
      breadcrumb: 'breadcrumb' in product ? (product as Product).breadcrumb : undefined,
    })
    toast.success('Đã thêm vào giỏ hàng', product.name)
  }

  function toggleWishlist(product: Product) {
    const isInWishlist = wishlistStore.isInWishlist(String(product.id))
    wishlistStore.toggleItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.thumbnail,
      slug: product.slug,
    })
    if (isInWishlist) {
      toast.success('Đã xóa khỏi yêu thích', product.name)
    } else {
      toast.success('Đã thêm vào yêu thích', product.name)
    }
  }

  function isInWishlist(productId: string | number): boolean {
    return wishlistStore.isInWishlist(String(productId))
  }

  return {
    addToCart,
    toggleWishlist,
    isInWishlist,
    cartStore,
    wishlistStore,
  }
}
