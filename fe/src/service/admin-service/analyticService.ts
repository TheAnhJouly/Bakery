import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin'

const getTotalRevenue = (params: any) => {
  return adminInstance.get(API_URL_ADMIN + '/analytics/total', { params })
}

const getStatsData = (params: any) => {
  return adminInstance.get(API_URL_ADMIN + '/analytics/stats', { params })
}

const getOutOfStockItem = (limit?: any) => {
  return adminInstance.get(API_URL_ADMIN + '/products/outofstock', { params: { limit: limit ? limit : undefined } })
}
const getBestSellerProduct = (amount?: number) => {
  if (!amount) return adminInstance.get(API_URL_ADMIN + `/products/bestseller`)
  return adminInstance.get(API_URL_ADMIN + `/products/bestseller?amount=${amount}`)
}

const analyticService = {
  getOutOfStockItem,
  getStatsData,
  getTotalRevenue,
  getBestSellerProduct,
}

export default analyticService
