import { Result } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { SpinContainer } from '../../components/spin-container';
import { clearCart } from '../../redux/slice/cartSlice';
import paymentService from '../../service/paymentService';
import { useLocation } from 'react-router';
const { vnpayIpn } = paymentService;

export const ResultContainer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const data = location.state?.status;

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    const paramList = {};

    for (const [key, value] of searchParams.entries()) {
      // @ts-ignore
      paramList[key] = value;
    }
    vnpayIpn(paramList).then((res: any) => {
      console.log(res);
      if (res.data.RspCode === "00") {
        setStatus('0');
        dispatch(clearCart())
      }
      else setStatus('1');

    })
      .catch((err: any) => {
        console.log(err);
      })
    setIsLoading(false);
    // Do something with paramList...
  }, [dispatch]);
  if (data?.status) {
    dispatch(clearCart())
  }
  if (isLoading) return (<SpinContainer spinning={true} size="large" type='auto' width='100%' height="50vh" />)
  return (
    <>
      {(status === '0' || data?.status) && (<Result
        status="success"
        title="Bạn đã mua hàng thành công"
        subTitle={(
          <div>
            <p>Please wait for the shop to prepare and deliver to you!</p>
            <p>If you have any questions, please contact: 0123456789</p>
          </div>
        )}
        extra={[
          <button
            onClick={() => {
              window.location.href = 'account/transaction'
            }}
            className="w-[200px] h-[50px]  border bg-baseColor text-[#FFFFFF]  duration-300"
          >
            <p>Check Transactions</p>
          </button>,

        ]}
      />)}
      {(status === '1') && (<Result
        status="error"
        title="Payment failed, please try again"
        subTitle={(
          <div>
            <p>If you have any questions, please contact: 0123456789</p>
          </div>
        )}
        extra={[
          <button
            onClick={() => {
              window.location.href = '/checkout'
            }}
            className="w-[200px] h-[50px]  border bg-baseColor text-[#FFFFFF]  duration-300"
          >
            <p>Go to home</p>
          </button>,

        ]}
      />)}
    </>
  )
}
