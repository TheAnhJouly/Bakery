import { Divider, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { FixPriceFormat } from '../../common/price-format/FixPrice'
import { SalePrice } from '../../common/price-format/SalePrice'
import productService from '../../service/productService'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/slice/cartSlice'
import { RootState } from '../../redux/store'
import { Review } from '../../components/review'


type ProductItemProps = {
  productId: string
}

type productDataType = {
  id: number
  name: string
  slug: string
  price: number
  description: string
  salePrice: number
  coverImage: string
  quantity: number
  deletedAt: string | null
}

export const preventMinus = (e: any) => {
  if (e.code === 'Minus') {
    e.preventDefault()
  }
}

export const ProductDetailContainer = ({ productId }: ProductItemProps) => {
  const userData = useSelector((state: RootState) => state.auth)
  const [productData, setProductData] = useState<productDataType>()
  const [quantity, setQuantity] = useState(1)

  console.log('productData', productData)
  const dispatch = useDispatch()

  useEffect(() => {
    if (productId) {
      productService
        .getProductDetail(productId)
        .then((res) => {
          setProductData(res.data);
        })
        .catch((err) => console.log(err))
    }
  }, [productId, setProductData])

  const handleAddToCart = () => {
    if (!userData.isLoggedIn) {
      message.warning('Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng !')
    } else if (!quantity || quantity.toString() === '0') {
      message.error('Vui lòng chọn số lượng bạn muốn thêm vào giỏ hàng')
    } else if (quantity > productData?.quantity!) {
      message.error('Số lượng bánh không đủ')
    } else {
      dispatch(
        addToCart({
          id: productData?.id!,
          name: productData?.name!,
          price: productData?.salePrice! < productData?.price! ? productData?.salePrice! : productData?.price!,
          quantity: quantity ? quantity : 1,
          coverImage: productData?.coverImage!,
        })
      )
      message.success('Thêm vào giỏ hàng thành công')
    }
  }

  const onChange = (event: any) => {
    setQuantity(event.target.value)
  }
  return (
    <div className=" px-[8%] mt-4 ">
      <div className="flex w-full bg-[#FFFFFF] p-[2vh] rounded-[6px] px-[12%]">
        <div className="basis-[40%] mr-[24px]">
          <img className="w-full aspect-[1/1] object-center" src={productData?.coverImage} alt={productData?.slug}></img>
        </div>
        <div className="basis-[50%] flex-col pl-[50px] pr-[50px]">
          <div className="text-[36px] mb-2">{productData?.name}</div>
          <p className="text-[20px]">{productData?.description}</p>
          <p className='pt-2'>Số lượng bánh hiện có: {productData?.quantity}</p>
          <Divider />
          {productData?.salePrice! < productData?.price! ? (
            <div className="flex-col justify-center w-full">
              <SalePrice fontSize='28px' salePrice={productData?.salePrice} />
              <FixPriceFormat fontSize='16px' price={productData?.price} />
            </div>
          ) : (
            <SalePrice fontSize='24px' salePrice={productData?.price} />
          )}

          {
            productData?.deletedAt === null ?
              <div className=''>
                <div className="flex mt-4 items-center">
                  <div className='pr-3 text-[#555555] text-[20px]'>Số lượng: </div>
                  <Input
                    min={1}
                    onKeyPress={preventMinus}
                    // style={{ fontSize: 24, width: '150px' }}
                    defaultValue={1}
                    placeholder="1"
                    className="w-1/4"
                    type="number"
                    onChange={onChange}
                  />
                </div>
                <Divider />
                <button
                  onClick={handleAddToCart}
                  className="h-[50px] w-1/2 bg-white border bg-baseColor pl-[30px] pr-[30px] text-[#FFFFFF] rounded-md"
                >
                  <p>Thêm vào giỏ hàng</p>
                </button>
              </div>
              : <div className='mt-4 bg-[#C92127] w-fit px-4 py-2 text-[#FFFFFF]'>Sản phẩm ngừng kinh doanh</div>
          }
        </div>
      </div>
      <div className='bg-[#FFFFFF] my-4 py-4 px-[2vh]'>
        <Review productId={+productId} userId={userData.user?.id!} />
      </div>

    </div>
  )
}
