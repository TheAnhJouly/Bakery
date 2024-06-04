import { Helmet } from "react-helmet";
import BigCategoryContainer from "../../../containers/admin/big-category";

export const MenAdminPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <BigCategoryContainer type='Bánh bao' />
      </div>
    </div>
  );
};
