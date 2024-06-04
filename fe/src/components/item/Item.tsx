import { useNavigate } from 'react-router-dom'
import { ProductData } from '../../containers/product/type'
import { FixPriceFormat } from '../../common/price-format/FixPrice'
import { SalePrice } from '../../common/price-format/SalePrice'
import { useDispatch } from 'react-redux'
import { addToRecently } from '../../redux/slice/recentlySlice'

const ProductItem = ({ coverImage, name, price, id, salePrice, text }: ProductData) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  return (
    <div
      onClick={() => {
        navigate(`/product/${id.toString()}`)
        dispatch(addToRecently({ id, coverImage, name, price, salePrice }))
      }}
      className="flex-col mr-5 ml-5 mt-8 justify-center items-center cursor-pointer h-[300px] w-[212px] p-[10px] hover:-translate-y-1"
    >
      <div className="relative">
        <img src={coverImage} alt={name} className="rounded-t-lg w-[240px] aspect-[1/1] object-center" />
        {salePrice < price ? (
          <div className="absolute bg-[#F7941E] text-[#FFFFFF] top-3 right-3 px-2 h-[44px] w-[44px] flex justify-center items-center rounded-full">
            -{Math.round((1 - salePrice / price) * 100)}%
          </div>
        ) : null}
      </div>
      <p className={text ? `pt-2 text-[#000000] text-center text-[20px]` : `pt-2 text-[#FFFFFF] text-center text-[20px]`}>{name}</p>
      {salePrice < price ? (
        <div>
          <div className='flex justify-center'>
            <SalePrice fontSize='20px' salePrice={salePrice} />
          </div>
          <div className='flex justify-center'>
            <FixPriceFormat fontSize='16px' price={price} />
          </div>
        </div>

      ) : (
        <div className='flex justify-center'>
          <SalePrice fontSize='20px' salePrice={price} />
        </div>
      )}
    </div>
  )
}

export default ProductItem
