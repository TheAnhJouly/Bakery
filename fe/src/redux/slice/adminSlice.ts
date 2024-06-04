import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AdminData {
  id: number
  avatar: string
  email: string
  name: string
  token: string
}

interface AdminState {
  isLoggedIn: boolean
  admin: AdminData | null
}

const initialState: AdminState = {
  isLoggedIn: false,
  admin: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginAdmin(state, action: PayloadAction<AdminData>) {
      state.isLoggedIn = true
      state.admin = action.payload
    },
    logoutAdmin(state) {
      state.isLoggedIn = false
      state.admin = null
    },
  },
})

export const { loginAdmin, logoutAdmin } = adminSlice.actions
export default adminSlice.reducer
