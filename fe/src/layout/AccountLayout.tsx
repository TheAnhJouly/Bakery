import { TransactionOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Divider } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { RootState } from '../redux/store'

interface LayoutProps {
  children: React.ReactNode
}

const AccountLayout: React.FC<LayoutProps> = ({ children }) => {
  const authData = useSelector((state: RootState) => state.auth)
  const userData = authData.user
  const navigate = useNavigate()
  return (
    <div className="flex pl-[8%] pr-[8%] mt-[4vh] ">
      <div className="flex-col basis-[25%] pt-6">
        <div className="flex">
          <Avatar size={52} icon={<UserOutlined />} src={userData?.avatar} />
          <div className="flex-col pl-4">
            <div>{userData?.email}</div>
            <div>{userData?.name}</div>
          </div>
        </div>
        <Divider />
        <div className="flex-col ">
          <div onClick={() => navigate('/account/profile')} className="flex items-center my-2 cursor-pointer">
            <UserOutlined />
            <div className="pl-2 text-[20px]">Thông tin tài khoản</div>
          </div>
          <div onClick={() => navigate('/account/transaction')} className="flex items-center my-2 cursor-pointer">
            <TransactionOutlined />
            <div className="pl-2 text-[20px]">Quản lý đơn hàng</div>
          </div>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}

export default AccountLayout
