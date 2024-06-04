import { useEffect, useState } from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import ProductItem from '../item/Item'
import productService from '../../service/productService'
import { BestSellerData } from './type'
import CommonIcon from '../../assets/icon.jpg'

const BestSeller = () => {
  const [bestSellerData, setBestSellerData] = useState<BestSellerData[]>([])

  useEffect(() => {
    productService
      .getBestSellerProduct()
      .then((res) => setBestSellerData(res.data))
      .catch((err) => console.log(err))
  }, [])
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  }
  return (
    <div className="mt-12 rounded-[6px] pb-[12vh]">
      <div className='flex justify-center'>
        <img src={CommonIcon} alt='icon' />
      </div>
      <div className="text-[40px] text-[#FFFFFF] py-1 pl-4 rounded-t-[6px] text-center">Sản phẩm nổi bật</div>
      <div className="text-[20px] text-[#FFFFFF] py-1 pl-4 rounded-t-[6px] text-center">Cập nhật những sản phẩm nổi bật nhất từ Cake Shop</div>
      <Carousel responsive={responsive} itemClass="carousel-item-padding-40-px" infinite draggable={false}>
        {bestSellerData?.map((data: BestSellerData) => (
          <ProductItem
            salePrice={data.salePrice}
            id={data.id}
            coverImage={data.coverImage}
            name={data.name}
            price={data.price}
          />
        ))}
      </Carousel>
    </div>
  )
}

export default BestSeller
