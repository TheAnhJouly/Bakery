import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/reviews'

const deleteReview = (reviewId: number) => {
  return adminInstance.delete(API_URL_ADMIN + `/${reviewId}`)
}

const reviewService = {
  deleteReview,
}

export default reviewService
