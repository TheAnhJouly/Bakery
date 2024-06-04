import { Form, Input } from "antd";
import { Typography } from "antd";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { useCallback } from "react";
import { authService } from "../../service/authService";
import { useDispatch } from "react-redux";
import { loginAdmin } from "../../redux/slice/adminSlice";
import AdminInstance from "../../adminAuth";
const { Title } = Typography;

type DataRequest = {
  email: string,
  password: string
}
export const LoginAdminPageContainer = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<DataRequest>()


  const [form] = Form.useForm();
  const onSubmit = useCallback(() => {
    const data = getValues();
    const dataSubmit = {
      email: data.email,
      password: data.password,
      role: "admin"
    }

    authService.login(dataSubmit)
      .then((res) => {
        AdminInstance.setToken(res.data.token);
        dispatch(loginAdmin({
          id: res.data.id,
          avatar: res.data.avatar,
          email: res.data.email,
          name: res.data.name,
          token: res.data.token
        }))
        navigate('/admin/dashboard')
      })
      .catch((err) => {
        console.error(err.response.data.message)
        setError("root", { type: "custom", message: "Invalid credential" })
      })

  }, [dispatch, getValues, navigate, setError])

  return (
    <div className="px-[25%] py-[16vh] flex justify-center">
      <Form
        name="signin"
        form={form}
        initialValues={{
          remember: false,
        }}
        autoComplete="off"


      >
        <Title level={2} className="text-center">
          Admin Page
        </Title>

        <Form.Item
          label={<div className="w-[50px]">Email</div>}
          className="pt-6"
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
                message: 'Invalid email',
              },
              required: 'Please enter a email address',
            }}
            render={({ field: { value, onChange } }) => (
              <Input className="w-[300px]" value={value} onChange={onChange} />
            )}
          />
        </Form.Item>

        <Form.Item
          label={<div className="w-[50px]">Password</div>}
          help={<div>{!!errors && <div className="alert mt-1">{errors.password?.message?.toString()}</div>}</div>}
        >
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Vui lòng nhập mật khẩu',
            }}
            render={({ field: { value, onChange } }) => (
              <Input.Password className="w-[300px]" value={value} onChange={onChange} />
            )}
          />
        </Form.Item>


        <div className="flex justify-center">
          <div className="alert">{errors.root?.message}</div>
        </div>
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit(onSubmit)}
            className=" h-[40px] bg-white border  pl-[30px] pr-[30px] hover:bg-baseColor hover:text-[#FFFFFF]"
          >
            Đăng nhập
          </button>
        </div>


      </Form>
    </div>
  )
};