import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { ProductDetailContainer } from '../../containers/product-detail/ProductDetailContainer'
export const ProductItemPage = () => {
  let { productId } = useParams()

  return (
    <div className="">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home page</title>
      </Helmet>
      <div>
        <ProductDetailContainer productId={productId!} />
      </div>
    </div>
  )
}
