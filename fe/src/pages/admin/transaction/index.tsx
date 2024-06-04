import React from 'react'
import { Helmet } from 'react-helmet'
import { TransactionAdminContainer } from '../../../containers/admin/transaction'

export const TransactionAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <TransactionAdminContainer />
      </div>
    </div>
  )
}
