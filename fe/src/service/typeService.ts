import instance from '../auth'
const API_URL = '/api/types'

const getTypeById = (id: string) => {
  return instance.get(API_URL + `/${id}`)
}
const getTypeTree = () => {
  return instance.get(API_URL + '/type-tree')
}
const typeService = {
  getTypeById,
  getTypeTree,
}

export default typeService
