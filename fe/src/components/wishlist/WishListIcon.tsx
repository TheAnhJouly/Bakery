import { HeartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

export const WishListIcon = () => {
  return (
    <div className="relative">
      <Link to={'/wishlist'}>
        <HeartOutlined className="relative p-3 hover:text-baseColor cursor-pointer text-[24px]" />
      </Link>
      <p className="absolute top-[6px] right-[6px] w-[15px] h-[15px] text-[10px] flex justify-center items-center text-[#FFFFFF] bg-baseColor rounded-full">
        0
      </p>
    </div>
  )
}
