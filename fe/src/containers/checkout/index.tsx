import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Divider, Input, message } from 'antd'
import dayjs from 'dayjs'
import { CheckoutItem } from './CheckoutItem'
import { SalePrice } from '../../common/price-format/SalePrice'
import { TProductCart } from '../../components/cart/type'
import { authService } from '../../service/authService'
import transactionService from '../../service/transactionService'
import paymentService from '../../service/paymentService'
import { useNavigate } from 'react-router-dom';
export type UserDetailData = {
  id: number
  name: string
  email: string
  gender: string
  birthday: string
  phone: string
  address: string
  avatar: string
}

export const CheckoutContainer = () => {
  const authData = useSelector((state: RootState) => state.auth)
  const cartData = useSelector((state: RootState) => state.cart)
  const [userInfor, setUserInfor] = useState<UserDetailData>()
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const getTotalPrice = (items: TProductCart[]) => {
    let totalPrice = 0
    for (const item of items) {
      totalPrice += item.price * item.quantity
    }
    return totalPrice
  }

  const totalPrice = getTotalPrice(cartData.items)

  const creataTransaction = useCallback(async () => {
    const dataSubmit = {
      userId: authData.user?.id,
      productList: cartData.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      transactionMethod: "cash",
      description: note,
      totalPrice: totalPrice
    }
    transactionService.createTransaction(dataSubmit)
      .then((res) => {
        if (res) {
          const data = { status: 1 };
          navigate('/result', { state: { status: data } });
        } else {
          message.error('Số lượng sản phẩm không đủ')
        }
      })
      .catch((err) => {
        console.log(err);
        message.error('Có lỗi xảy ra', 5)
      })


  }, [authData.user?.id, cartData.items, navigate, note, totalPrice])

  const handleOnlinePayment = async () => {
    const dataSubmit = {
      userId: authData.user?.id,
      productList: cartData.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      })),
      transactionMethod: "vnpay",
      description: note,
      totalPrice: totalPrice
    }
    try {
      const transaction = await transactionService.createTransaction(dataSubmit);
      if (!transaction) throw new Error("error")
      const paymentData = {
        transactionId: transaction.data.id,
        bankCode: "VNBANK",
        language: "vn"
      }
      const result = await paymentService.createPaymentURL(paymentData);
      window.location.href = result.data.url;
    } catch (e) {
      console.log(e);
      message.error('Số lượng bánh trong đơn nhiều hơn số lượng hiện có')
    }
  }

  useEffect(() => {
    authService
      .getUserProfile(authData.user?.id!)
      .then((res) => {
        setUserInfor(res.data)
      })
      .catch((err) => console.log(err))
  }, [authData.user?.id])

  return (
    <div className="pl-[8%] pr-[8%] bg-[#FFFFFF] my-[4vh] py-[4vh] flex">
      <div className="basis-[60%] p-4">
        <div className="text-[24px]">Chi tiết đơn hàng</div>
        <div className="">
          <div>Người nhận</div>
          <div>{userInfor?.name}</div>
          <Divider className="bg-[#e5e5e5] mt-0" />
        </div>
        <div className="">
          <div>Email: </div>
          <div>{userInfor?.email}</div>
          <Divider className="bg-[#e5e5e5] mt-0" />
        </div>
        <div className="">
          <div>Số điện thoại: </div>
          <div>{userInfor?.phone}</div>
          <Divider className="bg-[#e5e5e5] mt-0" />
        </div>
        <div className="">
          <div>Sinh ngày: </div>
          <div>{userInfor?.birthday ? dayjs(userInfor?.birthday).format('DD-MM-YYYY').toString() : null}</div>
          <Divider className="bg-[#e5e5e5] mt-0" />
        </div>
        <div className="">
          <div>Địa chỉ nhận hàng: </div>
          <div>{userInfor?.address}</div>
          <Divider className="bg-[#e5e5e5] mt-0" />
        </div>
        <div className="">
          <div>Ghi chú: </div>
          <Input.TextArea autoSize={{ minRows: 3 }} value={note}
            onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <div className="basis-[40%] p-4 border">
        <div className="text-[24px]">Đơn hàng</div>
        {cartData.items.map((data) => (
          <CheckoutItem
            quantity={data.quantity}
            price={data.price}
            id={data.id}
            name={data.name}
            coverImage={data.coverImage}
          />
        ))}
        <Divider className="bg-[#e5e5e5] mt-0" />
        <div className="flex justify-between pr-4">
          <div>Tổng giá tiền:</div>
          <SalePrice salePrice={getTotalPrice(cartData.items)} />
        </div>
        <Divider className="bg-[#e5e5e5] mt-2" />
        <div className="flex justify-center">
          <button
            onClick={() => {
              creataTransaction();
            }}
            className="w-full h-[50px]  border bg-baseColor text-[#FFFFFF]  duration-300"
          >
            <p>Thanh toán khi nhận hàng</p>
          </button>
        </div>
        <div className="flex justify-center pt-4">
          <button className="w-full h-[50px] bg-[#22222299] border hover:bg-baseColor text-[#FFFFFF] duration-300"
            onClick={handleOnlinePayment}
          >
            <p>Thanh toán bằng VNPay</p>
          </button>
        </div>
      </div>
    </div>
  )
}
