import { Helmet } from 'react-helmet'
import DashBoardAdminContainer from '../../../containers/admin/dashboard'

export const DashBoardAdmin = () => {
  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <DashBoardAdminContainer />
      </div>
    </div>
  )
}
