import React, { useEffect, useState } from 'react'
import { Table, Select, message, Button, Input } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { CreditCardTwoTone, MoneyCollectTwoTone } from '@ant-design/icons';
import transactionService from '../../../service/admin-service/transactionService';
import { formatPrice } from '../../../utilities/formatPrice';

interface TransactionType {
  id: number;

  user: any;
  products: any;
  paymentStatus: number
  deliveryStatus: string;
  description: string;
  totalPrice: string;
  transactionMethod: string;
}

const { Option } = Select;

export const TransactionAdminContainer = () => {

  const [transData, setTransData] = useState<TransactionType[]>([]);
  const [inputSearch, setInputSearch] = useState('');
  const [filteredData, setFilteredData] = useState<TransactionType[]>();

  console.log(transData)
  const deliveryStatusOptions = [
    { value: 'confirmming', label: 'Chờ xác nhận' },
    { value: 'init', label: 'Đang chuẩn bị' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'received', label: 'Đã nhận' },
    { value: 'canceled', label: 'Đã hủy' },
  ];

  const [option, setOption] = useState<string>('name');
  const handleDeliveryStatusFilter = (value: string) => {
    if (value === 'all') {
      setFilteredData(transData);
    } else {
      setFilteredData(transData.filter((transaction) => transaction.deliveryStatus === value));
    }
  }

  const handleSearchNameInput = (value: string) => {
    if (value === 'name') {
      setFilteredData(transData.filter((transaction) => transaction.user.name.toLowerCase().includes(inputSearch.toLowerCase())));
    } else if (value === 'phone') {
      setFilteredData(transData.filter((transaction) => transaction.user.phone.toLowerCase().includes(inputSearch.toLowerCase())));
    } else if (value === 'email') {
      setFilteredData(transData.filter((transaction) => transaction.user.email.toLowerCase().includes(inputSearch.toLowerCase())));
    }
  }

  const handlePaymenMethodFilter = (value: string) => {
    if (value === 'all') {
      setFilteredData(transData);
    } else {
      setFilteredData(transData.filter((transaction) => transaction.transactionMethod === value));
    }
  }

  const columns: ColumnType<TransactionType>[] = [
    {
      title: 'Thông tin người nhận',
      dataIndex: 'user',
      key: 'user',
      render: (_: any, record: TransactionType) => {
        return (
          <div className='flex-col'>
            <div className='py-2'>{record.user.name}</div>
            <div className='py-2'>{record.user.phone}</div>
            <div className='py-2'>{record.user.email}</div>
          </div >
        )
      }
    },
    {
      title: 'Chi tiết đơn hàng',
      dataIndex: 'product',
      key: 'product',
      width: '25%',
      render: (_: any, record: TransactionType) => {
        console.log('12341234', record)
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
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_: any, record: TransactionType) => {
        return (
          <div className='flex'>
            {formatPrice(+record.totalPrice)} VNĐ
          </div >
        )
      }
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'transactionMethod',
      key: 'transactionMethod',
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
      render: (_: any, record: any) => {
        return <>
          {record.paymentstatus
            === "1" || record.deliveryStatus === 'received' ? <p>Paid</p> : <p>Not paid</p>}
        </>
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      render: (value: any, record: any) => {
        const handleChange = async (value: any) => {
          try {
            const res = await transactionService.updateTransaction(record.id, value, record.transactionMethod)
            if (res.status === 200) {
              message.success('Transaction updated successfully');
              record.deliveryStatus = value;
              setTransData([...transData]);
            }
          } catch (error) {
            console.log('error', error);
            message.error('Something went wrong');
          }
        };

        return (
          <Select value={value} onSelect={handleChange}>
            {deliveryStatusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      },
    },
  ];

  useEffect(() => {
    transactionService.getAllTransaction()
      .then((res) => {
        setTransData(res.data)
        setFilteredData(res.data)
      })
      .catch((err) => console.log(err))
  }, [])


  return <div>
    <div>
      <Select className='py-4' style={{ width: 200 }} defaultValue={'all'} onChange={handleDeliveryStatusFilter}>
        <Option value="all">Tất cả đơn hàng</Option>
        <Option value="confirmming">Đang xác nhận</Option>
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
      <Input onChange={(e) => setInputSearch(e.target.value)} value={inputSearch} placeholder='Tìm kiếm theo' className='w-[300px] ml-2' />
      <Select className='' style={{ width: 150 }} defaultValue={'name'} onChange={(e) => setOption(e)}>
        <Option value="name">Mã đơn hàng</Option>
        <Option value="phone">Số điện thoại</Option>
        <Option value="email">Email</Option>
      </Select>
      <Button onClick={() => handleSearchNameInput(option!)}>Tìm</Button>
      <Table dataSource={filteredData} columns={columns} />
    </div>
  </div>

}

