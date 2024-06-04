import React from 'react'
import { Helmet } from 'react-helmet';
import { ResultContainer } from '../../containers/result';

export const ResultPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>ResultPage</title>
      </Helmet>
      <div>
        <ResultContainer />
      </div>
    </div>
  );
}
