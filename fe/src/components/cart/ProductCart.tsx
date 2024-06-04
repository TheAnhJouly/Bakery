import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'
import { addToCart, discreaseQuantity, removeFromCart } from '../../redux/slice/cartSlice'
import { TProductCart } from './type'
import { SalePrice } from '../../common/price-format/SalePrice'
import { useDispatch } from 'react-redux'

type TProps = { productCartData: TProductCart }

export const ProductCart: React.FC<TProps> = ({ productCartData }) => {
  const dispatch = useDispatch()
  return (
    <div className="flex p-2">
      <div className=" w-[160px] pr-2">
        <img src={productCartData.coverImage} alt={productCartData.name} />
      </div>
      <div className="basis-[100%]">
        <p className="text-[16px]">{productCartData.name}</p>
        <div className="flex mt-2">
          <div className="flex justify-start items-center border w-fit mr-4">
            <MinusOutlined
              className="text-[12px] mx-2"
              onClick={() =>
                dispatch(
                  discreaseQuantity({
                    name: productCartData.name,
                    price: productCartData.price,
                    id: productCartData.id,
                    coverImage: productCartData.coverImage,
                    quantity: 1,
                  })
                )
              }
            />
            <span className="text-[16px]">{productCartData.quantity}</span>
            <PlusOutlined
              className="text-[12px] mx-2"
              onClick={() => {
                dispatch(
                  addToCart({
                    name: productCartData.name,
                    price: productCartData.price,
                    id: productCartData.id,
                    coverImage: productCartData.coverImage,
                    quantity: 1,
                  })
                )
              }}
            />
          </div>
        </div>

        <div className="flex justify-start items text-[12px]  mt-2">
          <span className="text-[16px] mr-2">Giá:</span>{' '}
          <SalePrice salePrice={productCartData.price * productCartData.quantity} />
        </div>
      </div>
      <button onClick={() => dispatch(removeFromCart(productCartData))} className="text-[24px]">
        <Tooltip placement="top" title="Delete">
          <DeleteOutlined />
        </Tooltip>
      </button>
    </div>
  )
}
