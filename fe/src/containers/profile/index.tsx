import { DatePicker, Divider, Input, Radio, Upload, message, Progress } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import { UserDetailData } from './type'
import { preventMinus } from '../product-detail/ProductDetailContainer'
import storage from '../../firebaseConfig'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'
import { RcFile } from 'antd/es/upload'
import { authService } from '../../service/authService'
import { updateUser } from '../../redux/slice/authSlice'

export const ProfileContainer = () => {
  const authData = useSelector((state: RootState) => state.auth)

  const [userData, setUserData] = useState<UserDetailData>()
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty },
  } = useForm<UserDetailData>()
  const [percent, setPercent] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  const customRequest = async ({ file, onSuccess }: RcCustomRequestOptions) => {
    const fil = file as RcFile
    setPreviewUrl(URL.createObjectURL(fil))
    const storageRef = ref(storage, `/users/${userData?.id}/avatar.${fil.name.substring(fil.name.lastIndexOf('.') + 1)}`) // progress can be paused and resumed. It also exposes progress updates. // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, fil)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) // update progress
        setPercent(percent)
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setValue('avatar', url)
          console.log(url)
        })
      }
    )
    onSuccess?.(true)
  }

  const onSubmit = useCallback(async () => {
    const data = getValues()
    try {
      const res = await authService.updateUser(userData?.id!, data)
      dispatch(
        updateUser({
          id: res.data.id,
          address: res.data.address,
          avatar: res.data.avatar,
          email: res.data.email,
          name: res.data.name,
          phone: res.data.phone,
          birthday: res.data.birthday,
          gender: res.data.gender,
          token: authData.user?.token!,
        })
      )
      message.success('Cập nhật thông tin cá nhân thành công')
    } catch (error) {
      console.log(error)
    }
  }, [authData.user?.token, dispatch, getValues, userData?.id])

  useEffect(() => {
    authService
      .getUserProfile(authData.user?.id!)
      .then((res) => {
        setUserData(res.data)
        setValue('name', res.data?.name!)
        setValue('gender', res.data?.gender!)
        setValue('birthday', res.data?.birthday!)
        setValue('phone', res.data?.phone!)
        setValue('address', res.data?.address!)
        setValue('avatar', res.data?.avatar!)
      })
      .catch((err) => console.log(err))
  }, [
    authData.user?.id,
    setValue,
    userData?.address,
    userData?.avatar,
    userData?.birthday,
    userData?.gender,
    userData?.name,
    userData?.phone,
  ])

  return (
    <div className="flex basis-[75%]">
      <div className="bg-[#FFFFFF] w-full p-6">
        <div>Thông tin cá nhân</div>
        <div className="pb-[4px]">Quản lý thông tin cá nhân của bạn</div>
        <Divider />
        <div className="flex">
          <div className="flex-col basis-[65%] ">
            <div className="flex pb-[30px]  items-center">
              <div className="w-[30%] text-right text-[#555555CC] pr-2">Email: </div>
              <div>{userData?.email}</div>
            </div>
            <div className="flex pb-[30px]  items-center">
              <div className="w-[30%] text-right text-[#555555CC] pr-2">Tên: </div>
              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <Input className="w-[300px]" value={value} onChange={onChange} />
                )}
              />
            </div>
            <div className="flex pb-[30px]  items-center">
              <div className="w-[30%] text-right text-[#555555CC] pr-2">Giới tính: </div>
              <Controller
                control={control}
                name="gender"
                render={({ field: { value, onChange } }) => (
                  <Radio.Group onChange={onChange} value={value}>
                    <Radio value={'male'}>Nam</Radio>
                    <Radio value={'female'}>Nữ</Radio>
                    <Radio value={'other'}>Khác</Radio>
                  </Radio.Group>
                )}
              />
            </div>
            <div className="flex pb-[30px]  items-center">
              <div className="w-[30%] text-right text-[#555555CC] pr-2">Sinh ngày: </div>
              <Controller
                control={control}
                name="birthday"
                render={({ field: { value, onChange } }) => (
                  <DatePicker onChange={onChange} value={dayjs(value)} defaultValue={dayjs(userData?.birthday)} />
                )}
              />
            </div>
            <div className="flex pb-[30px]  items-center">
              <div className="w-[30%] text-right text-[#555555CC] pr-2">Số điện thoại: </div>
              <Controller
                control={control}
                name="phone"
                render={({ field: { value, onChange } }) => (
                  <Input onKeyPress={preventMinus} className="w-[300px]" value={value} onChange={onChange} />
                )}
              />
            </div>
            <div className="flex pb-[30px] items-center">
              <div className="w-[30%] text-right text-[#555555CC] pr-2">Địa chỉ: </div>
              <Controller
                control={control}
                name="address"
                render={({ field: { value, onChange } }) => (
                  <Input onKeyPress={preventMinus} className="w-[300px]" value={value} onChange={onChange} />
                )}
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleSubmit(onSubmit)}
                className=" h-[50px] bg-white border  pl-[30px] pr-[30px] hover:bg-baseColor hover:text-[#FFFFFF]"
                disabled={percent !== 0 && percent !== 100}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
          <div className="basis-[35%] border-l border-l-[#efefef] text-center">
            <div className="flex justify-center mb-4">
              <img
                className="rounded-full w-[150px] h-[150px]"
                src={previewUrl ? previewUrl : userData?.avatar}
                alt={userData?.name}
              />
            </div>
            <Upload
              customRequest={(e) => {
                customRequest({ ...e })
              }}
              maxCount={1}
              showUploadList={false}
            >
              <button
                onClick={handleSubmit(onSubmit)}
                className=" h-[50px] bg-white border  pl-[30px] pr-[30px] hover:bg-baseColor hover:text-[#FFFFFF]"
                disabled={percent !== 0 && percent !== 100}
              >
                Tải ảnh lên
              </button>
            </Upload>

            {percent !== 0 && percent !== 100 && <Progress percent={percent} steps={5} />}
            {/* <button className=" h-[50px] bg-white border  pl-[30px] pr-[30px] hover:bg-baseColor hover:text-[#FFFFFF]">
              Upload image
            </button> */}
          </div>
        </div>
      </div>
    </div>
  )
}
