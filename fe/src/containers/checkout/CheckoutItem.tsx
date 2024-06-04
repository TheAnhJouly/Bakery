import React from 'react'
import { SalePrice } from '../../common/price-format/SalePrice'

type CheckoutItemProps = {
  id: number
  name: string
  coverImage: string
  price: number
  quantity: number
}

export const CheckoutItem = (item: CheckoutItemProps) => {
  return (
    <div>
      <div className="flex p-2">
        <div className=" w-[120px] pr-2">
          <img src={item.coverImage} alt={item.name} />
        </div>
        <div className="basis-[100%]">
          <p className="text-[16px]">{item.name}</p>
          <div className="flex mt-2">
            <div className="flex justify-start items-center w-fit mr-12">
              <span className="text-[16px]">Số lượng: {item.quantity}</span>
            </div>
            <span className="text-[16px] mr-2"></span> <SalePrice salePrice={item.price * item.quantity} />
          </div>
        </div>
      </div>
    </div>
  )
}
