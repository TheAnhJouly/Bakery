import axios from 'axios'
import instance from '../auth'
const API_URL = '/api/payment/vnpay'
const createPaymentURL = (data: any) => {
  return instance.post(API_URL + '/create_payment_url', data)
}
const vnpayIpn = (params: any) => {
  return instance.get(API_URL + '/vnpay_ipn', { params })
}
const paymentService = {
  createPaymentURL,
  vnpayIpn,
}

export default paymentService
