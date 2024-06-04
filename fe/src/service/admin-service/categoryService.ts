import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/categories'

const getAllCategories = () => {
  return adminInstance.get(API_URL_ADMIN)
}

const getCategoryByBigCategory = (bigCategoryId: number) => {
  return adminInstance.get(API_URL_ADMIN + `/bigCategory/${bigCategoryId}`)
}

const createCategory = (data: any) => {
  return adminInstance.post(API_URL_ADMIN, data)
}

const updateCategory = (id: number, categoryName: string): any => {
  return adminInstance.patch(API_URL_ADMIN + `/${id}`, { name: categoryName })
}

const deleteCategory = (id: number) => {
  return adminInstance.delete(API_URL_ADMIN + `/${id}`)
}

const categoriesService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryByBigCategory,
}

export default categoriesService
