import instance from '../auth'
const API_URL = '/api/carousels'

const getAllCarousel = () => {
  return instance.get(API_URL)
}

const carouselService = {
  getAllCarousel,
}

export default carouselService
