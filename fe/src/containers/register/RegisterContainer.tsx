import { DatePicker, Form, Input, Radio, message } from 'antd'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { authService } from '../../service/authService'
import { useNavigate } from 'react-router'

type DataRequest = {
  name: string
  email: string
  password: string
  gender: string
  birthday: string
  address: string
  phone: string
  role: string
}
export const RegisterContainer = () => {
  const navigate = useNavigate()
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<DataRequest>()

  const preventMinus = (e: any) => {
    if (e.code === 'Minus') {
      e.preventDefault()
    }
  }

  const onSubmit = useCallback(() => {
    const data: DataRequest = getValues()

    data.birthday = dayjs(data.birthday).format('YYYY-MM-DD')
    data.role = 'user'
    authService
      .register(data)
      .then((res) => {
        navigate('/')
        message.info('Mời bạn đăng nhập')
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setError('email', { type: 'custom', message: err.response.data.message })
        }
      })
  }, [getValues, navigate, setError])

  return (
    <div className="pl-[8%] pr-[8%] bg-[#FFFFFF] my-[4vh] py-[4vh]">
      <div className="text-[32px] uppercase">Create account</div>
      <div className="flex justify-center">
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }}>
          <Form.Item
            label="Email"
            help={<div>{!!errors && <div className="alert mt-1">{errors.email?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="email"
              rules={{
                pattern: {
                  value:
                    //eslint-disable-next-line
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                  message: 'Email not valid',
                },
                required: 'Please enter a valid email address',
              }}
              render={({ field: { value, onChange } }) => (
                <Input className="w-[300px]" value={value} onChange={onChange} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            help={<div>{!!errors && <div className="alert mt-1">{errors.password?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Please enter a password',
              }}
              render={({ field: { value, onChange } }) => (
                <Input.Password className="w-[300px]" value={value} onChange={onChange} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Name"
            help={<div>{!!errors && <div className="alert mt-1">{errors.name?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="name"
              rules={{
                required: 'Please enter your name',
                maxLength: {
                  value: 50,
                  message: 'Name up to 50 characters long',
                },
              }}
              render={({ field: { value, onChange } }) => (
                <Input className="w-[300px]" value={value} onChange={onChange} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Gender"
            help={<div>{!!errors && <div className="alert mt-1">{errors.gender?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="gender"
              rules={{
                required: 'Please select a gender',
              }}
              render={({ field: { value, onChange } }) => (
                <Radio.Group onChange={onChange} value={value}>
                  <Radio value={'male'}>Male</Radio>
                  <Radio value={'female'}>Female</Radio>
                  <Radio value={'other'}>Others</Radio>
                </Radio.Group>
              )}
            />
          </Form.Item>

          <Form.Item
            label="Birthdate"
            help={<div>{!!errors && <div className="alert mt-1">{errors.birthday?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="birthday"
              rules={{
                required: 'Please select a birth day',
              }}
              render={({ field: { value, onChange } }) => (
                <DatePicker onChange={onChange} defaultValue={dayjs(value)} value={dayjs(value)} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            help={<div>{!!errors && <div className="alert mt-1">{errors.phone?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="phone"
              rules={{
                required: 'Please enter a phone number',
                pattern: {
                  value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                  message: 'Please enter a right number',
                },
              }}
              render={({ field: { value, onChange } }) => (
                <Input onKeyPress={preventMinus} className="w-[300px]" value={value} onChange={onChange} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Address"
            help={<div>{!!errors && <div className="alert mt-1">{errors.address?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="address"
              rules={{
                required: 'Please enter a valid address',
                maxLength: {
                  value: 100,
                  message: 'Address must be at latest 100 characters',
                },
              }}
              render={({ field: { value, onChange } }) => (
                <Input className="w-[300px]" value={value} onChange={onChange} />
              )}
            />
          </Form.Item>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit(onSubmit)}
              className=" h-[40px] bg-white border  pl-[30px] pr-[30px] hover:bg-baseColor hover:text-[#FFFFFF]"
            >
              Sign up
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
