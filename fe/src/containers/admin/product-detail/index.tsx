import { Button, Divider, Input, Modal, message } from "antd"
import { useEffect, useState } from "react"
import { FixPriceFormat } from "../../../common/price-format/FixPrice"
import { SalePrice } from "../../../common/price-format/SalePrice"
import { useLocation, useNavigate } from "react-router"
import productService from "../../../service/admin-service/productService"
import { Review } from "../../../components/review"

type productDataType = {
  id: number
  name: string
  slug: string
  price: number
  description: string
  salePrice: number
  coverImage: string
  deletedAt: string | undefined
  saleCount: number
  quantity: number
}

export const preventMinus = (e: any) => {
  if (e.code === 'Minus') {
    e.preventDefault()
  }
}

export const ProductDetailAdminContainer = () => {
  const [productData, setProductData] = useState<productDataType>()
  const location = useLocation()
  const data = location.state.status;
  const productId = data.status;
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(productData)

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleDeleteProduct()
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteProduct = () => {
    productService.deleteProduct(productId)
      .then((response) => {
        if (response.status === 200) {
          message.success("Product deleted successfully")
          navigate('/admin/product')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    try {
      productService.getProductDetail(productId)
        .then((res) => setProductData(res.data))
        .catch((err) => console.log(err))

    } catch (error) {

    }
  }, [productId])


  return (
    <div className="bg-[#FFFFFF] px-2 mx-4 pb-4">
      <div className="flex p-4">
        <div className="relative">
          {
            productData?.deletedAt ? <div className="border text-[#FFFFFF] bg-baseColor w-fit px-4 absolute top-2 left-2">Product deleted</div> : null
          }
          <img className="w-[400px] aspect-[1/1] object-center" src={productData?.coverImage} alt={productData?.slug}></img>
        </div>
        <div className="pl-12 w-full">
          <div className="text-[44px]">{productData?.name}</div>
          <div className="flex items-center">
            {
              productData?.salePrice! < productData?.price! ? (<div>
                <FixPriceFormat fontSize="16px" price={productData?.price} />
                <SalePrice fontSize="24px" salePrice={productData?.salePrice} />
              </div>) : <SalePrice fontSize="24px" salePrice={productData?.salePrice} />
            }
          </div>
          <p className="text-[20px]">{productData?.description}</p>
          <Divider />
          <div key={data.id} className="flex w-full items-center justify-between">
            <div className="h-[40px]">
              Số lượng đã bán: {productData?.saleCount!}
            </div>
            <div className="h-[40px]">
              Còn lại: {productData?.quantity}
            </div>
          </div>
          <Divider />
        </div>
      </div>
      <div className="flex justify-between px-4">
        {
          !productData?.deletedAt ? <Button onClick={showModal} type="default">Xóa sản phẩm</Button> : null
        }
        <Button onClick={() => navigate('/admin/product/update', { state: { status: { id: productId } } })} type="default">Cập nhật</Button>
      </div>
      <div className='bg-[#FFFFFF] mt-4 py-4 px-[2vh]'>
        <Review productId={+productId} isAdmin={true} />
      </div>
      <Modal open={isModalOpen} onOk={handleOk} okButtonProps={{ type: 'default' }} onCancel={handleCancel}>
        <div className="p-4">
          <p className="text-[16px]">Bạn có muốn xóa sản phẩm này không?</p>
        </div>
      </Modal>
    </div>
  )
}
