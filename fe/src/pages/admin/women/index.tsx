import { Helmet } from "react-helmet";
import BigCategoryContainer from "../../../containers/admin/big-category";

export const WomenAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <BigCategoryContainer type='Bánh mì' />
      </div>
    </div>
  );
};
