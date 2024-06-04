import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/bigcategories'

const getAllBigCategories = () => {
  return adminInstance.get(API_URL_ADMIN)
}

const getCategoryDetails = (id: number) => {
  return adminInstance.get(API_URL_ADMIN + `/${id}`)
}

const getCategoryByType = (id: number) => {
  return adminInstance.get(API_URL_ADMIN + `/type/${id}`)
}

const createBigCategory = (data: any) => {
  return adminInstance.post(API_URL_ADMIN, data)
}

const updateBigCategory = (id: number, categoryName: string): any => {
  return adminInstance.patch(API_URL_ADMIN + `/${id}`, { name: categoryName })
}

const deleteBigCategory = (id: number) => {
  return adminInstance.delete(API_URL_ADMIN + `/${id}`)
}

const bigCategoriesService = {
  getAllBigCategories,
  getCategoryDetails,
  getCategoryByType,
  createBigCategory,
  updateBigCategory,
  deleteBigCategory,
}

export default bigCategoriesService
