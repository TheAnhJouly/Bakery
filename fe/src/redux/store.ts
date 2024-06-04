import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import authReducer from './slice/authSlice'
import cartReducer from './slice/cartSlice'
import recentlyReducer from './slice/recentlySlice'
import adminReducer from './slice/adminSlice'

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  recently: recentlyReducer,
  admin: adminReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'recently', 'admin'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

const store = configureStore({
  reducer: persistedReducer,
})

const persistor = persistStore(store)

const storeConfig = { store, persistor }

export default storeConfig
