import { Helmet } from "react-helmet";
import ProductPageContainer from "../../containers/product/ProductPageContainer";

export const ProductPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <ProductPageContainer />
      </div>
    </div>
  );
};
