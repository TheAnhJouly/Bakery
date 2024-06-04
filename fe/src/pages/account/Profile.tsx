import React from 'react'
import { Helmet } from 'react-helmet'
import { ProfileContainer } from '../../containers/profile'
import AccountLayout from '../../layout/AccountLayout'
export const Profile = () => {
  return (
    <AccountLayout>
      <div className="">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Profile</title>
        </Helmet>
        <div>
          <ProfileContainer />
        </div>
      </div>
    </AccountLayout>
  )
}
