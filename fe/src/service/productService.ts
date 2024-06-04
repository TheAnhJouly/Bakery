import axios from 'axios'
import instance from '../auth'
const API_URL = '/api/products'

const getAllProduct = () => {
  return instance.get(API_URL + '/page/1')
}

const getProductDetail = (id: string) => {
  return instance.get(API_URL + `/${id}`)
}

const getProductByType = (typeId: number) => {
  return instance.get(API_URL + `/type/${typeId}`)
}

const getProductByBigCategory = (bigcategoryId: number) => {
  return instance.get(API_URL + `/bigcategory/${bigcategoryId}`)
}

const getProductByCategory = (categoryId: number) => {
  return instance.get(API_URL + `/category/${categoryId}`)
}

const getBestSellerProduct = (amount?: number) => {
  if (!amount) return instance.get(API_URL + `/bestseller`)
  return instance.get(API_URL + `/bestseller?amount=${amount}`)
}

const getNewestProduct = (amount?: number) => {
  if (!amount) return instance.get(API_URL + `/newest`)
  return instance.get(API_URL + `/newest?amount=${amount}`)
}
const getProductByName = (name: string) => {
  return instance.get(API_URL + `?name=${name}`)
}

const productService = {
  getAllProduct,
  getProductDetail,
  getProductByType,
  getProductByBigCategory,
  getProductByCategory,
  getNewestProduct,
  getBestSellerProduct,
  getProductByName,
}

export default productService
