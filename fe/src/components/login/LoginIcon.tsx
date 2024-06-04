import { UserOutlined } from '@ant-design/icons'
import { Input, message, Modal } from 'antd'
import { useState } from 'react'
import LoginBanner from '../../assets/login/sign-in.jpg'
import { Dropdown } from 'antd'
import { MenuProps } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { authService } from '../../service/authService'
import { login, logout } from '../../redux/slice/authSlice'
import { useNavigate } from 'react-router'
import instance from '../../auth'

export const LoginIcon = () => {
  const isLogin = useSelector((state: RootState) => state.auth.isLoggedIn)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()

  const handleSignout = () => {
    dispatch(logout())
    navigate('/')
  }

  const items: MenuProps['items'] = [
    {
      label: <div onClick={() => navigate('/account/profile')}>Tài khoản của tôi</div>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={() => navigate('/account/transaction')}>Theo dõi đơn hàng</div>,
      key: '2',
    },
    {
      type: 'divider',
    },
    {
      label: <div onClick={handleSignout}>Đăng xuất</div>,
      key: '3',
    },
  ]

  const showModal = () => {
    if (!isLogin) {
      setIsModalOpen(true)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onSubmit = async () => {
    const data = getValues()
    try {
      authService
        .login({ email: data.email, password: data.password, role: 'user' })
        .then((res: any) => {
          dispatch(login(res.data))
          console.log(res)
          instance.setToken(res.data.token);
          console.log(instance.defaults);
          message.success('Đăng nhập thành công')
          setIsModalOpen(false)
        })
        .catch((err: any) => {
          console.log(err)
          message.error("Thông tin tài khoản hoặc mật khẩu không chính xác")
        })
    } catch (error) { }
  }

  return (
    <div className="relative">
      <Dropdown overlayStyle={{ width: '160px' }} disabled={!isLogin} menu={{ items }} placement="bottomRight">
        <div onClick={() => showModal()} className='p-3 cursor-pointer flex flex-col justify-center items-center w-max hover:text-baseColor '>
          <UserOutlined className="    text-[28px] whitespace-nowrap " />
          Tài khoản
        </div>
      </Dropdown>

      <div className="absolute left-0 w-[200px]">
        <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          {/* <img width={'100%'} src={LoginBanner} alt="login"></img> */}
          <div className="h-fit pb-4">
            <div className="flex-col p-[24px] ">
              <div className='flex justify-center text-[28px] font-[600] py-4 '>Đăng Nhập</div>
              <Controller
                control={control}
                name="email"
                rules={{
                  pattern: {
                    value:
                      //eslint-disable-next-line
                      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                    message: 'Invalid email',
                  },
                  minLength: {
                    value: 3,
                    message: 'Email must be at least 3 characters',
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <div className='flex mb-4'>
                    <div className='flex justify-center items-center h-auto basis-[20%]'>
                      Email:
                    </div>
                    <Input
                      size="middle"
                      placeholder="Email*"
                      // className="mb-4"
                      value={value}
                      onChange={onChange}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <div className='flex'>
                    <div className='flex justify-center items-center h-auto basis-[20%]'>
                      Mật khẩu:
                    </div>
                    <Input.Password
                      size="middle"
                      placeholder="Password*"
                      type="password"
                      value={value}
                      onChange={onChange}
                    />
                  </div>
                )}
              />
              <p className="mt-[17px] mb-[12px] alert">
                {errors.root?.message}
              </p>
              <p className='pl-2 mb-4 underline text-end pr-[20px] cursor-pointer'>Quên mật khẩu?</p>
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit(onSubmit)}
                  className="w-[90%] h-[40px] bg-baseColor borde text-[#FFFFFF]  duration-300"
                >
                  <p>Đăng nhập</p>
                </button>
              </div>
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => (window.location.href = '/register')}
                  className="w-[90%] h-[40px] bg-[#eeeeee] hover:bg-[#cccccc] text-[#000000] duration-300"
                >
                  <p>Bạn chưa có tài khoản? Đăng kí ngay</p>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
