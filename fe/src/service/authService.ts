import instance from '../auth'
const API_URL = '/api/auth/'

type DataRequest = {
  name: string
  email: string
  password: string
  gender: string
  birthday: string
  address: string
  phone: string
  role: string
}

const register = (dataUser: DataRequest) => {
  return instance.post(API_URL + 'register', dataUser)
}

const login = ({ email, password, role }: any) => {
  return instance.post(API_URL + 'login', {
    email,
    password,
    role,
  })
}

const updateUser = (id: number, body: any) => {
  return instance.patch(API_URL + `/${id}`, body)
}

const logout = () => {
  localStorage.removeItem('user')
}

const getUserProfile = (id: number) => {
  return instance.get(API_URL + `${id}`)
}

export const authService = {
  register,
  login,
  logout,
  updateUser,
  getUserProfile,
}
