import React from 'react'
import { Helmet } from 'react-helmet'
import { LoginAdminPageContainer } from '../../../containers/admin/LoginAdminPageContainer'

export const LoginAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <LoginAdminPageContainer />
      </div>
    </div>
  )
}
