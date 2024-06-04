import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/sizes'

const getAllSize = () => {
  return adminInstance.get(API_URL_ADMIN)
}

const createSize = (data: any) => {
  return adminInstance.post(API_URL_ADMIN, data)
}

const updateSize = (id: number, sizeName: string): any => {
  return adminInstance.patch(API_URL_ADMIN + `/${id}`, { name: sizeName })
}

const deleteSize = (sizeId: string) => {
  return adminInstance.delete(API_URL_ADMIN + `/${sizeId}`)
}

const sizeService = {
  getAllSize,
  createSize,
  updateSize,
  deleteSize,
}

export default sizeService
