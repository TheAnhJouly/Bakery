import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserData {
  id: number
  address: string
  avatar: string
  email: string
  name: string
  phone: string
  birthday: string
  gender: string
  token: string
}

interface AuthState {
  isLoggedIn: boolean
  user: UserData | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserData>) {
      state.isLoggedIn = true
      state.user = action.payload
    },
    logout(state) {
      state.isLoggedIn = false
      state.user = null
    },
    updateUser(state, action: PayloadAction<UserData>) {
      state.isLoggedIn = true
      state.user = action.payload
    },
  },
})

export const { login, logout, updateUser } = authSlice.actions
export default authSlice.reducer
