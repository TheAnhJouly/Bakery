import HomePageContainer from "../../containers/home-page/HomePageContainer";
import { Helmet } from "react-helmet";

const HomePage = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <HomePageContainer />
      </div>
    </div>
  );
};

export default HomePage;
