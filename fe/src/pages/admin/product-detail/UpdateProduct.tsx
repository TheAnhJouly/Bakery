import React from 'react'
import { Helmet } from 'react-helmet'
import { CreateProductContainer } from '../../../containers/admin/product-detail/CreateProductContainer'

export const UpdateProductPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <CreateProductContainer isUpdate />
      </div>
    </div>
  )
}
