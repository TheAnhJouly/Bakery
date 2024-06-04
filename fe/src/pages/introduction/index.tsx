import { Helmet } from "react-helmet";
import IntroductionPageContainer from "../../containers/introduction/IntroductionPageContainer";

export const IntroductionPage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <IntroductionPageContainer />
      </div>
    </div>
  );
};
