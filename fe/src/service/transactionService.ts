import instance from '../auth'
const API_URL = '/api/transactions'

const getAllTransaction = () => {
  return instance.get(API_URL + '/page/1')
}

const getTransactionDetail = (id: string) => {
  return instance.get(API_URL + `/${id}`)
}

const createTransaction = (data: any) => {
  return instance.post(API_URL, data)
}

const getTransactionByUserId = (userID: number) => {
  return instance.get(API_URL + `/user/${userID}`)
}

const cancelTransaction = (id: number) => {
  return instance.patch(API_URL + `/cancel/${id}`)
}

const transactionService = {
  getAllTransaction,
  getTransactionDetail,
  createTransaction,
  getTransactionByUserId,
  cancelTransaction,
}

export default transactionService
