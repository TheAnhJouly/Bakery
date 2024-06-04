import { formatPrice } from '../../utilities/formatPrice'

interface FixPriceFormatProps {
  price: number | undefined
  fontSize?: string
}
export const FixPriceFormat = (props: FixPriceFormatProps) => {
  const { price, fontSize } = props
  return (
    <span style={{ fontSize: fontSize }} className="text-[16px] line-through text-[#b1c23c]">
      {formatPrice(price)}đ
    </span>
  )
}
