import { Helmet } from "react-helmet";
import { RegisterContainer } from "../../containers/register/RegisterContainer";

export const RegisterPage = () => {
	return (
		<div className="">
			<Helmet>
				<meta charSet="utf-8" />
				<title>Home page</title>
			</Helmet>
			<div>
				<RegisterContainer />
			</div>
		</div>
	);
};
