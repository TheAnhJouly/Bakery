import { Helmet } from 'react-helmet'
import AccountLayout from '../../layout/AccountLayout'
import { TransactionContainer } from '../../containers/transaction'

export const Transaction = () => {
  return (
    <AccountLayout>
      <div className="">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Order</title>
        </Helmet>
        <div>
          <TransactionContainer />
        </div>
      </div>
    </AccountLayout>
  )
}
