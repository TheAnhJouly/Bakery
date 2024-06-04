import { formatPrice } from '../../utilities/formatPrice'

interface FixPriceFormatProps {
  salePrice?: number | undefined
  fontSize?: string
}
export const SalePrice = (props: FixPriceFormatProps) => {
  const { salePrice, fontSize } = props
  return (
    <div style={{ fontSize: fontSize }} className="text-[16px] text-[#b1c23c]">
      {formatPrice(salePrice)}đ
    </div>
  )
}
