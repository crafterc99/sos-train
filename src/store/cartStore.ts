import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  product_id: string
  name: string
  price_cents: number
  quantity: number
  size?: string
  color?: string
  image_url?: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  totalCents: () => number
  itemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((s) => {
          const existing = s.items.find(
            (i) => i.product_id === item.product_id && i.size === item.size && i.color === item.color
          )
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product_id === item.product_id && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...s.items, item] }
        })
      },

      removeItem: (productId, size, color) => {
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.product_id === productId && i.size === size && i.color === color)
          ),
        }))
      },

      updateQuantity: (productId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color)
          return
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.product_id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      totalCents: () => get().items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'sos-cart' }
  )
)
