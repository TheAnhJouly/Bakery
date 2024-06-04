import { Helmet } from "react-helmet";
import PersonnelAdminContainer from "../../../containers/admin/personnel";

export const PersonnelAdmin = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <PersonnelAdminContainer />
      </div>
    </div>
  );
};
