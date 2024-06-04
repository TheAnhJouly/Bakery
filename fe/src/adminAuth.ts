import axios, { AxiosInstance } from 'axios'
interface MyAxiosInstance extends AxiosInstance {
  setToken: (token: string) => void
}
const adminInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 5 * 1000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}) as MyAxiosInstance
adminInstance.setToken = (token) => {
  adminInstance.defaults.headers.common.Authorization = token
  localStorage.setItem('adminToken', token)
}
adminInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem('adminToken')
    return config
  },
  (err) => {
    console.log(err)
    return err
  }
)
adminInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    if (err.response) {
      const { status } = err.response
      if (status === 401 || status === 403) {
        window.location.href = '/admin/login'
      }
    }
  }
)
export default adminInstance
