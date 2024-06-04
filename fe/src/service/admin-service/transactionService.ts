import adminInstance from '../../adminAuth'
const API_URL_ADMIN = '/api/admin/transactions'

const getAllTransaction = () => {
  return adminInstance.get(API_URL_ADMIN)
}

const createTransaction = (data: any) => {
  return adminInstance.post(API_URL_ADMIN, data)
}

const updateTransaction = (id: number, status: string, transactionMethod: string): any => {
  return adminInstance.patch(API_URL_ADMIN + `/${id}`, { deliveryStatus: status, transactionMethod: transactionMethod })
}

const deleteTransaction = (transactionId: string) => {
  return adminInstance.delete(API_URL_ADMIN + `/${transactionId}`)
}

const transactionService = {
  getAllTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
}

export default transactionService
