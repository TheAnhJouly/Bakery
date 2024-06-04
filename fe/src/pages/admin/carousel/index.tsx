import React from 'react'
import { Helmet } from 'react-helmet';
import { CarouselAdminContainer } from '../../../containers/admin/carousel/CarouselAdminContainer';

export const CarouselAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <CarouselAdminContainer />
      </div>
    </div>
  );
}
