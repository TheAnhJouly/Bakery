import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home'
import { LoginAdminPage } from './pages/admin/login/Login'
import { ErrorPage } from './pages/error-page'
import { IntroductionPage } from './pages/introduction'
import { PersonnelAdmin } from './pages/admin/personnel'
import { UserLayout, AdminLayout } from './layout/Layout'
import { ProductPage } from './pages/product'
import { NewsPage } from './pages/news'
import { ContactPage } from './pages/contact'
import { WishListPage } from './pages/wishlist'
import { RegisterPage } from './pages/register'
import { Provider } from 'react-redux'
import storeConfig from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

import { Profile } from './pages/account/Profile'
import { ProductItemPage } from './pages/product-detail'
import { Transaction } from './pages/account/Transaction'
import { ConfigProvider } from 'antd'
import { SearchPage } from './pages/search'
import { CheckoutPage } from './pages/checkout'
import { ResultContainer } from './containers/result'
import { ProductAdminPage } from './pages/admin/product'
import { MenAdminPage } from './pages/admin/men'
import { WomenAdminPage } from './pages/admin/women'
import { KidsAdminPage } from './pages/admin/kids'
import { DashBoardAdmin } from './pages/admin/dashboard'
import { CategoryAdminPage } from './pages/admin/category'
import { ProductDetailAdminPage } from './pages/admin/product-detail'
import { TransactionAdminPage } from './pages/admin/transaction'
import { CreateProductPage } from './pages/admin/product-detail/CreateProduct'
import { UpdateProductPage } from './pages/admin/product-detail/UpdateProduct'
import { CarouselAdminPage } from './pages/admin/carousel'

export const App = () => {
  return (
    <BrowserRouter>
      <Provider store={storeConfig.store}>
        <PersistGate loading={null} persistor={storeConfig.persistor}>
          <>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#7f4227',
                },
              }}
            >
              <Routes>
                <Route path="/" element={UserLayout(<HomePage />)} />
                <Route path="/introduction" element={UserLayout(<IntroductionPage />)} />
                <Route path="/product" element={UserLayout(<ProductPage />)} />
                <Route path="/product/:productId" element={UserLayout(<ProductItemPage />)} />
                <Route path="/news" element={UserLayout(<NewsPage />)} />
                <Route path="/contact" element={UserLayout(<ContactPage />)} />
                <Route path="/wishlist" element={UserLayout(<WishListPage />)} />
                <Route path="/register" element={UserLayout(<RegisterPage />)} />
                <Route path="/men" element={UserLayout(<ProductPage />)} />
                <Route path="/women" element={UserLayout(<ProductPage />)} />
                <Route path="/kids" element={UserLayout(<ProductPage />)} />
                <Route path="/account/profile" element={UserLayout(<Profile />)} />
                <Route path="/account/transaction" element={UserLayout(<Transaction />)} />
                <Route path="/search/:name" element={UserLayout(<SearchPage />)} />
                <Route path="/checkout" element={UserLayout(<CheckoutPage />)} />
                <Route path="/result" element={UserLayout(<ResultContainer />)} />
                <Route path="/admin/login" element={<LoginAdminPage />} />
                <Route path="/admin/personnel" element={AdminLayout(<PersonnelAdmin />)} />
                <Route path="/admin/dashboard" element={AdminLayout(<DashBoardAdmin />)} />
                <Route path="/admin/men" element={AdminLayout(<MenAdminPage />)} />
                <Route path="/admin/women" element={AdminLayout(<WomenAdminPage />)} />
                <Route path="/admin/kid" element={AdminLayout(<KidsAdminPage />)} />
                <Route path="/admin/product" element={AdminLayout(<ProductAdminPage />)} />
                <Route path="/admin/:category" element={AdminLayout(<CategoryAdminPage />)} />
                <Route path="/admin/product/:id" element={AdminLayout(<ProductDetailAdminPage />)} />
                <Route path="/admin/product/create" element={AdminLayout(<CreateProductPage />)} />
                <Route path="/admin/product/update" element={AdminLayout(<UpdateProductPage />)} />
                <Route path="/admin/transaction" element={AdminLayout(<TransactionAdminPage />)} />
                <Route path="/admin/carousel" element={AdminLayout(<CarouselAdminPage />)} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </ConfigProvider>
          </>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  )
}
