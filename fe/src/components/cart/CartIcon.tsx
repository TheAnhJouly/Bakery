import { CloseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Drawer } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { ProductCart } from './ProductCart'
import { TProductCart } from './type'
import { formatPrice } from '../../utilities/formatPrice'

export const CartIcon = () => {
  const [open, setOpen] = useState(false)
  const carts = useSelector((state: RootState) => state.cart)

  const getTotalPrice = (items: TProductCart[]) => {
    let totalPrice = 0
    for (const item of items) {
      totalPrice += item.price * item.quantity
    }
    return totalPrice
  }

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  return (
    <div className="relative">
      <div onClick={() => showDrawer()} className='p-3 cursor-pointer flex flex-col justify-center items-center w-max hover:text-baseColor'>
        <ShoppingCartOutlined className="relative    text-[28px]" />
        Đơn hàng
      </div>
      <p className="absolute top-[8px] right-[24px] w-[15px] h-[15px] text-[10px] flex justify-center items-center text-[#FFFFFF] bg-baseColor rounded-full">
        {carts.items.length}
      </p>
      <Drawer
        title={
          <div className="flex items-center">
            <span className="text-[20px]">ĐƠN HÀNG CỦA BẠN ({carts.items.length})</span>
            <CloseOutlined
              onClick={onClose}
              className="absolute right-4 cursor-pointer text-[#a4a4a4] hover:text-[#000000]"
            />
          </div>
        }
        closable={false}
        placement="right"
        onClose={onClose}
        open={open}
        rootClassName=""
      >
        <div className="">
          {carts.items.length === 0 ? (
            <div>
              <p>Không có sản phẩm trong giỏ hàng</p>
            </div>
          ) : (
            carts.items.map((cart) => <ProductCart productCartData={cart} />)
          )}
        </div>
        {carts.items.length > 0 && (
          <div>
            <div className="mt-6 text-[24px] flex">
              <div className="mr-2 mb-4">Tổng giá tiền:</div>
              <div className="text-baseColor">{formatPrice(getTotalPrice(carts.items))}đ</div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => (window.location.href = '/checkout')}
                className="w-full h-[50px] bg-white border  pl-[30px] pr-[30px] hover:bg-baseColor hover:text-[#FFFFFF]"
              >
                <p>Thanh toán ngay</p>
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
