import React from 'react'
import { Helmet } from 'react-helmet';
import CategoryContainer from '../../../containers/admin/category';

export const CategoryAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <CategoryContainer />
      </div>
    </div>
  );
}
