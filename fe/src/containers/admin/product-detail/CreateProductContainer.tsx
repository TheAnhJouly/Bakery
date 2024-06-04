import { Button, Checkbox, Form, Input, Progress, Select, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface'
import Upload, { RcFile } from 'antd/es/upload'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import storage from '../../../firebaseConfig';
import bigCategoriesService from '../../../service/admin-service/bigCategoryService';
import categoriesService from '../../../service/admin-service/categoryService';
import productService from '../../../service/admin-service/productService';
import { useLocation } from 'react-router';
import { CheckboxChangeEvent } from 'antd/es/checkbox';


type ProductType = {
  name: string,
  price: number,
  description: string,
  coverImage: string,
  salePrice: number,
  categoryId: number,
  quantity: number
}

type TPops = {
  isUpdate?: boolean
}

export const CreateProductContainer: React.FC<TPops> = ({ isUpdate }) => {
  const { handleSubmit, control, setValue, getValues, watch, formState: { errors } } = useForm<ProductType>();
  const location = useLocation();
  const data = location.state?.status;
  const productId = data?.id

  const [percent, setPercent] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const typeOptions = [{
    value: 1,
    label: 'Bánh bao',
  },
  {
    value: 2,
    label: 'Bánh mì',
  },
  {
    value: 3,
    label: "Bánh kem",
  }]
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [bigCategoryOptions, setBigCategoryOptions] = useState([])

  const [typeSelected, setTypeSelected] = useState();
  const [bigCategorySelect, setCategorySelect] = useState();
  const [checked, setChecked] = useState(false);
  const priceWatch = watch('price')

  const onChange = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
  };

  const onSubmit = () => {
    const data = getValues();
    console.log('data', data)
    if (!checked || data.salePrice === undefined) {
      data.salePrice = priceWatch;
    }
    if (!isUpdate) {
      productService.createProduct(data)
        .then((res) => {
          message.success('Tạo sản phẩm thành công')

        })
        .catch((err) => {
          console.log('err', err);
          message.error('Đã xảy ra lỗi')
        })
    } else {
      productService.updateProduct(productId, data)
        .then((res: any) => {
          message.success('Cập nhật sản phẩm thành công')
        })
        .catch((err: any) => {
          console.log('err', err);
          message.error('Đã xảy ra lỗi')
        }
        )

    }
  }


  useEffect(() => {

    if (isUpdate) {
      productService.getProductDetail(productId)
        .then((res) => {
          setValue('name', res.data?.name!)
          setValue('price', res.data?.price!)
          setValue('description', res.data?.description!)
          setPreviewUrl(res.data?.coverImage!)
          setValue('coverImage', res.data?.coverImage!)
          setValue('salePrice', res.data?.salePrice!)
          setValue('categoryId', res.data?.categoryId!)
          setValue('quantity', res.data?.quantity)
        })
        .catch((err) => console.log(err))
    }

  }, [isUpdate, productId, setValue, typeSelected])

  useEffect(() => {
    bigCategoriesService.getCategoryByType(typeSelected!)
      .then((res) => setBigCategoryOptions(res.data.map((data: any) => {
        return {
          value: data.id,
          label: data.name,
        }
      })))
      .catch((err) => console.log(err))
  }, [typeSelected])

  useEffect(() => {
    categoriesService.getCategoryByBigCategory(bigCategorySelect!)
      .then((res) => setCategoryOptions(res.data.map((data: any) => {
        return {
          value: data.id,
          label: data.name,
        }
      })))
      .catch((err) => console.log(err))
  }, [bigCategorySelect, typeSelected])

  // const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

  const customRequest = async ({ file, onSuccess }: RcCustomRequestOptions) => {
    const fil = file as RcFile
    setPreviewUrl(URL.createObjectURL(fil))
    const storageRef = ref(storage, `/products/${fil.name}`) // progress can be paused and resumed. It also exposes progress updates. // Receives the storage reference and the file to upload.
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
          setValue('coverImage', url)
          console.log(url)
        })
      }
    )
    onSuccess?.(true)
  }
  return (
    <div className="bg-[#FFFFFF] px-2 mx-4 flex pb-10">

      <div className='basis-[60%] w-full'>
        <Form
          name="basic"
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 900 }}
          autoComplete="off"
          className='basis-[60%] m-4'
        >
          {
            isUpdate === true ? <div className='flex justify-center text-[24px] py-4'>Cập nhật sản phẩm</div> : <div className='flex justify-center text-[24px] py-4'>Tạo mới sản phẩm</div>
          }

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            labelCol={{ span: 4, offset: 1 }}
            help={<div>{!!errors && <div className="alert mt-1">{errors.name?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="name"
              rules={{
                required: 'Trường này không được bỏ trống'
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  className="mb-4 flex justify-center items-center"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Form.Item>



          <Form.Item
            label="Mô tả"
            name="description"
            labelCol={{ span: 4, offset: 1 }}
            help={<div>{!!errors && <div className="alert mt-1">{errors.description?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="description"
              rules={{
                required: 'Trường này không được bỏ trống'
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  className="mb-4 flex justify-center items-center"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            labelCol={{ span: 4, offset: 1 }}
            help={<div>{!!errors && <div className="alert mt-1">{errors.price?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="price"
              rules={{
                required: 'Trường này không được bỏ trống'
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  className="mb-4 flex justify-center items-center"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Khuyến mãi" className='pt-0' labelCol={{ span: 4, offset: 1 }}>
            <Checkbox onChange={onChange} />
          </Form.Item>

          <Form.Item
            label="Giá khuyến mãi"
            name="salePrice"
            labelCol={{ span: 4, offset: 1 }}
            help={<div>{!!errors && <div className="alert mt-1">{errors.salePrice?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="salePrice"
              rules={{
                max: {
                  value: priceWatch,
                  message: "Sales price must be less than or equal price"
                }
              }}
              render={({ field: { value, onChange } }) => (
                <Input
                  disabled={!checked}
                  className="mb-4 flex justify-center items-center"
                  value={checked === true ? value : priceWatch}
                  onChange={onChange}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            labelCol={{ span: 4, offset: 1 }}
            help={<div>{!!errors && <div className="alert mt-1">{errors.quantity?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="quantity"
              rules={
                {
                  required: 'Trường này không được bỏ trống', min: {
                    value: 1,
                    message: 'Số lượng sản phẩm phải lớn hơn 0'
                  }
                }
              }
              render={({ field: { value, onChange } }) => (
                <Input
                  className="mb-4 flex justify-center items-center"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Loại danh mục"
            name="category"
            labelCol={{ span: 4, offset: 1 }}
            help={<div>{!!errors && <div className="alert mt-1">{errors.categoryId?.message?.toString()}</div>}</div>}
          >
            <Controller
              control={control}
              name="categoryId"
              rules={{
                required: 'Trường này không được bỏ trống'
              }}
              render={({ field: { value, onChange } }) => (
                <div>
                  <Select
                    style={{ width: 160 }}
                    optionFilterProp="children"
                    onChange={(e) => setTypeSelected(e)}
                    options={typeOptions}
                  />
                  <Select
                    showSearch
                    style={{ width: 160 }}

                    optionFilterProp="children"
                    onChange={(e) => setCategorySelect(e)}
                    options={bigCategoryOptions}
                  />
                  <Select
                    showSearch
                    value={value}
                    style={{ width: 160 }}

                    optionFilterProp="children"
                    onChange={onChange}
                    options={categoryOptions}
                  />
                </div>
              )}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            {
              isUpdate === true ? (<Button onClick={handleSubmit(onSubmit)} type="default" htmlType="submit">
                Cập nhật sản phẩm
              </Button>) : <Button onClick={handleSubmit(onSubmit)} type="default" htmlType="submit">
                Tạo sản phẩm
              </Button>
            }


          </Form.Item>
        </Form>
      </div>
      <div className='basis-[40%] w-full flex-col justify-center items-center pt-12'>
        <img
          className="w-full aspect-square mb-4"
          src={previewUrl ? previewUrl : 'https://www.grouphealth.ca/wp-content/uploads/2018/05/placeholder-image-400x300.png'}
          alt={previewUrl}
        />

        <div className='flex justify-center'>
          <Upload
            customRequest={(e) => {
              customRequest({ ...e })
            }}
            maxCount={1}
            showUploadList={false}
          >
            <Button disabled={percent !== 0 && percent !== 100}>
              Tải ảnh lên
            </Button>
          </Upload>
        </div>
        {percent !== 0 && percent !== 100 && <Progress percent={percent} steps={5} />}
      </div>
    </div>
  )
}
