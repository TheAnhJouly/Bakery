import React from 'react'
import { Helmet } from 'react-helmet'
import { SearchContainer } from '../../containers/search'

export const SearchPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Search page</title>
      </Helmet>
      <div>
        <SearchContainer />
      </div>
    </div>
  )
}
