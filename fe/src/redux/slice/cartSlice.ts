import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number

  coverImage: string
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity = +existingItem.quantity + +action.payload.quantity
      } else {
        state.items.push({ ...action.payload })
      }
    },
    removeFromCart(state, action: PayloadAction<CartItem>) {
      const { id } = action.payload
      state.items = state.items.filter((item) => item.id !== id)
    },
    discreaseQuantity(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--
      }
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, clearCart, discreaseQuantity } = cartSlice.actions
export default cartSlice.reducer
