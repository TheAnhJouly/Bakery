import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/carousels'

const getAllCarouse = () => {
  return adminInstance.get(API_URL_ADMIN)
}

const createCarouse = (data: object) => {
  return adminInstance.post(API_URL_ADMIN, { ...data })
}

const deleteCarouse = (id: string) => {
  return adminInstance.delete(API_URL_ADMIN + `/${id}`)
}

const carouselService = {
  getAllCarouse,
  createCarouse,
  deleteCarouse,
}

export default carouselService
