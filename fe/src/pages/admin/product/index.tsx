import React from 'react'
import { Helmet } from 'react-helmet'
import { ProductAdminPageContainer } from '../../../containers/admin/product'

export const ProductAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <ProductAdminPageContainer />
      </div>
    </div>
  )
}
