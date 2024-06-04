import NewsItem from './NewsItem'
import 'react-multi-carousel/lib/styles.css'
import { Col, Row } from 'antd'
import CommonIcon from '../../assets/icon.jpg'
import Image1 from '../../assets/blog/1.jpg'
import Image2 from '../../assets/blog/2.jpg'
import Image3 from '../../assets/blog/3.jpg'
const data = [
  {
    key: '1',
    image: Image1,
    title: 'Bánh mì kẹp Fresh Garden - Bữa ăn nhanh, dinh dưỡng, tiện lợi',
    datePost: 'JULY 9, 2023',
    category: 'Cake'
  },
  {
    key: '2',
    image: Image2,
    title: 'Fresh Garden: Ưu đãi giảm giá 30% bánh mì tươi tại cửa hàng sau 20h hàng ngày',
    datePost: 'Oct 31, 2023',
    category: 'Promotion'
  },
  {
    key: '3',
    image: Image3,
    title: 'Ra đời từ tình yêu với những chiếc bánh, từ lâu Ban lãnh đạo cũng như toàn thể cán bộ n...',
    datePost: 'Nov 30, 2023',
    category: 'Cake'
  },
]

export const News = () => {
  return (
    <>
      <div className="mt-[8vh] bg-[#FFFFFF] rounded-[12px] py-[4vh]">
        <div className='flex justify-center'>
          <img src={CommonIcon} alt='icon' />
        </div>
        <div className="text-[40px] text-[#000000] py-1 pl-4 rounded-t-[6px] text-center">Tin tức</div>
        <div className="text-[20px] text-[#000000] py-1 pl-4 rounded-t-[6px] text-center">Nơi Cake shop cập nhật thông tin mới nhất vê sản phẩm, cửa hàng và ưu đãi</div>


        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {data.map((data) => (
            <Col className="gutter-row" span={8}>
              <NewsItem
                category={data.category}
                key={data.key}
                image={data.image}
                title={data.title}
                datePost={data.datePost}
              />{' '}
            </Col>
          ))}
        </Row>
      </div>
    </>
  )
}
