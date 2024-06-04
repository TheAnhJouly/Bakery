import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/products'

const getAllProductPagination = (page: number) => {
  return adminInstance.get(API_URL_ADMIN + `/page/${page}`)
}

const createProduct = (data: any) => {
  return adminInstance.post(API_URL_ADMIN, data)
}

const updateProduct = (id: number, data: any): any => {
  return adminInstance.patch(API_URL_ADMIN + `/${id}`, data)
}

const deleteProduct = (productId: string) => {
  return adminInstance.delete(API_URL_ADMIN + `/${productId}`)
}

const getProductDetail = (productId: string) => {
  return adminInstance.get(API_URL_ADMIN + `/${productId}`)
}

const productService = {
  getAllProductPagination,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
}

export default productService
