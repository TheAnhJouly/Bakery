import 'react-multi-carousel/lib/styles.css'
import { Col, Row } from 'antd'
import ProductItem from '../item/Item'
import { TNewestData } from './type'
import { useEffect, useState } from 'react'
import productService from '../../service/productService'
import CommonIcon from '../../assets/icon.jpg'

const New = () => {
  const [newItem, setNewItem] = useState<TNewestData[]>([])
  useEffect(() => {
    productService
      .getNewestProduct(8)
      .then((res) => setNewItem(res.data))
      .catch((err) => console.log(err))
  }, [])
  return (
    <div className="mt-4 pt-8 bg-[#FFFFFF] rounded-[6px] pb-12">
      <div className='flex justify-center'>
        <img src={CommonIcon} alt='icon' />
      </div>
      <div className="text-[40px] text-[#000000] py-1 pl-4 rounded-t-[6px] text-center">Sản phẩm mới</div>
      <div className="text-[20px] text-[#000000] py-1 pl-4 rounded-t-[6px] text-center">Chào mừng bạn đến với bộ sưu tập bánh mới nhất </div>      <Row gutter={{ xs: 6, sm: 16, md: 24, lg: 32 }} className="">
        {newItem.map((data) => (
          <Col className="gutter-row flex justify-center items-center" span={6}>
            <ProductItem
              text='primary'
              salePrice={data.salePrice}
              id={data.id}
              coverImage={data.coverImage}
              name={data.name}
              price={data.price}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default New
