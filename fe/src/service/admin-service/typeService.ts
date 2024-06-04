import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/types'

const getAllType = () => {
  return adminInstance.get(API_URL_ADMIN)
}

const createType = (data: any) => {
  return adminInstance.post(API_URL_ADMIN, data)
}

const updateType = (id: number, typeName: string): any => {
  return adminInstance.patch(API_URL_ADMIN + `/${id}`, { name: typeName })
}

const deleteType = (typeId: string) => {
  return adminInstance.delete(API_URL_ADMIN + `/${typeId}`)
}

const typeService = {
  getAllType,
  createType,
  updateType,
  deleteType,
}

export default typeService
