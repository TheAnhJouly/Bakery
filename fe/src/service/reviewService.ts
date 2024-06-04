import instance from '../auth'
const API_URL = '/api/reviews'

type ReviewRequest = {
  rate: number
  comment: string
  productId: number
  userId: number
}

const getReviewsByProductId = (productId: number) => {
  return instance.get(API_URL + `/${productId}`)
}

const createReview = (data: ReviewRequest) => {
  return instance.post(API_URL, data)
}

const reviewService = {
  getReviewsByProductId,
  createReview,
}

export default reviewService
