import React from 'react'
import { Helmet } from 'react-helmet'
import { ProductDetailAdminContainer } from '../../../containers/admin/product-detail'

export const ProductDetailAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <ProductDetailAdminContainer />
      </div>
    </div>
  )
}
