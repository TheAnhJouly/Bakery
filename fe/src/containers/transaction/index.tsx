import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import transactionService from '../../service/transactionService'
import { Table, Select, message, Button } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { CreditCardTwoTone, MoneyCollectTwoTone } from '@ant-design/icons';
import { formatPrice } from '../../utilities/formatPrice';
import paymentService from '../../service/paymentService';
import { TransactionStatus } from './type';

interface TransactionType {
  id: number;
  products: any
  paymentStatus: number
  deliveryStatus: string;
  description: string;
  totalPrice: string;
  transactionMethod: string;
}

const { Option } = Select;




export const TransactionContainer = () => {
  const authData = useSelector((state: RootState) => state.auth)
  const userId = authData.user?.id;
  const [transData, setTransData] = useState<TransactionType[]>([]);

  const [filteredData, setFilteredData] = useState<TransactionType[]>();
  const handleDeliveryStatusFilter = (value: string) => {
    if (value === 'all') {
      setFilteredData(transData);
    } else {
      setFilteredData(transData.filter((transaction) => transaction.deliveryStatus === value));
    }
  }

  const handlePaymenMethodFilter = (value: string) => {
    if (value === 'all') {
      setFilteredData(transData);
    } else {
      setFilteredData(transData.filter((transaction) => transaction.transactionMethod === value));
    }
  }

  const handlePayAgain = async (id: number) => {
    const paymentData = {
      transactionId: id,
      bankCode: "VNBANK",
      language: "vn"
    }
    const result = await paymentService.createPaymentURL(paymentData);
    window.location.href = result.data.url;
  }
  const columns: ColumnType<TransactionType>[] = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      width: '25%',
      align: 'center',
      render: (_: any, record: TransactionType) => {
        console.log(record)
        return (
          <div>
            {
              record.products.map((data: any) => (
                <div className='flex'>
                  <img className=" w-[140px] aspect-[1/1] object-center" src={data?.coverImage} alt={data?.coverImage} />
                  <div className='flex-col pl-2 pt-2'>
                    <p>{data?.name}</p>
                    <p>Số lượng:  {data.transaction_product?.quantity}</p>
                    {data.product?.salePrice ? <p>{formatPrice(data.product?.salePrice)}</p> : <p>{formatPrice(data.product?.price)}</p>}
                  </div>
                </div>
              ))
            }
          </div >
        )
      }
    },
    {
      title: 'Thạng thái đơn',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      align: 'center',
      render: (value: string) => {
        return <div>{(TransactionStatus as any)[value]}</div>
      }
    },

    {
      title: 'Tổng giá tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'center',
      render: (_: any, record: any) => {
        return <div>
          <p>{formatPrice(record?.totalPrice)}</p>
        </div>
      }
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'transactionMethod',
      key: 'transactionMethod',
      align: 'center',
      render: (_: any, record: any) => {
        return <>
          {record.transactionMethod
            === "vnpay" ? <p><CreditCardTwoTone /> VNPay </p> : <p><MoneyCollectTwoTone />Tiền mặt</p>}
        </>
      }
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentstatus',
      key: 'paymentstatus',
      align: 'center',
      render: (_: any, record: any) => {
        return <>
          {record.paymentstatus
            === "0" ? <p>Chưa thanh toán</p> : record.paymentstatus === "1" ? <p>Đã thanh toán</p> : <p>Thanh toán thất bại</p>}
          {(record.paymentstatus !== "1" && record.transactionMethod !== 'cash') && (
            <Button onClick={() => handlePayAgain(record.id)} className="mt-[1rem] bg-[#7F4227] text-[#FFFFFF]">
              Thanh toán lại
            </Button>
          )}
        </>
      }
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'cancel',
      key: 'cancel',
      align: 'center',
      render: (text: string, record: any) => {
        const handleCancelTransaction = async () => {
          try {
            const res = await transactionService.cancelTransaction(record.id)
            if (res.status === 200) {
              message.success("Đơn của bạn đã hủy thành công");
              const updatedData = transData.map((transaction) => {
                if (transaction.id === record.id) {
                  return { ...transaction, deliveryStatus: 'canceled' };
                }
                return transaction;
              });
              setFilteredData(updatedData);
            }
          } catch (error) {
            console.log(error);
            message.warning('Không thể hủy đơn hàng')
          }
        };
        return (
          <Button disabled={record.deliveryStatus !== 'confirmming'} type="default" onClick={handleCancelTransaction} >
            Hủy đơn
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    transactionService.getTransactionByUserId(userId!)
      .then((res) => {
        setTransData(res.data)
        setFilteredData(res.data)
      })
      .catch((err) => console.log(err))
  }, [userId])


  return <div>
    <div>
      <Select className='py-4' style={{ width: 200 }} defaultValue={'all'} onChange={handleDeliveryStatusFilter}>
        <Option value="all">Tất cả đơn hàng</Option>
        <Option value="confirmming">Chờ xác nhận</Option>
        <Option value="init">Đang chuẩn bị</Option>
        <Option value="shipping">Đang giao</Option>
        <Option value="received">Đã nhận</Option>
        <Option value="canceled">Đã hủy</Option>
      </Select>
      <Select className='py-4 pl-2' style={{ width: 200 }} defaultValue={'all'} onChange={handlePaymenMethodFilter}>
        <Option value="all">Tất cả thanh toán</Option>
        <Option value="cash">Tiền mặt</Option>
        <Option value="vnpay">VNPay</Option>
      </Select>
      <Table dataSource={filteredData} columns={columns} />
    </div>
  </div>
}
