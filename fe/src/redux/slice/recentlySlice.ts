import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Recently {
  id: number
  name: string
  price: number
  salePrice: number

  coverImage: string
}

interface RecentlyState {
  items: Recently[]
}

const initialState: RecentlyState = {
  items: [],
}

const recentlySlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToRecently(state, action: PayloadAction<Recently>) {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id)
      if (existingIndex !== -1) {
        // If the item already exists in the array, remove it from its current position
        const existingItem = state.items.splice(existingIndex, 1)[0]
        // Add the existing item to the top of the array
        state.items.unshift(existingItem)
      } else {
        // If the item does not exist in the array, add it to the top of the array
        state.items.unshift({ ...action.payload })
      }
    },
  },
})

export const { addToRecently } = recentlySlice.actions
export default recentlySlice.reducer
