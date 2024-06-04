import React from 'react'
import { Helmet } from 'react-helmet'
import { CheckoutContainer } from '../../containers/checkout'

export const CheckoutPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <CheckoutContainer />
      </div>
    </div>
  )
}
