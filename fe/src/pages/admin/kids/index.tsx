import { Helmet } from "react-helmet";
import BigCategoryContainer from "../../../containers/admin/big-category";

export const KidsAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <BigCategoryContainer type='Bánh kem' />
      </div>
    </div>
  );
};
