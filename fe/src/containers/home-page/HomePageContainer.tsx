import BestSeller from '../../components/best-seller/BestSeller'
import CarouselImage from '../../components/carousel/carousel'
import New from '../../components/new-item/New'
import { News } from '../../components/news/News'
import Recently from '../../components/recently/Recently'
import bgImg from '../../assets/background.jpg';

const HomePageContainer = () => {
  return (
    <div className="pl-[8%] pr-[8%] pt-4 pb-12" style={{ backgroundImage: `url(${bgImg})` }}>
      <CarouselImage />
      <BestSeller />
      <New />
      <Recently />
      <News />
    </div>
  )
}

export default HomePageContainer
