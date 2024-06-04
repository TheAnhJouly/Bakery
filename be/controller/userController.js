const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.models.User

function getPayload(request) {
  const token = request.headers.authorization
  return jwt.verify(token, process.env.JWT_SECRET)
}

const userController = {
  register: async (req, res) => {
    // Lấy dữ liệu từ body của request
    const { name, email, password, gender, birthday, address, phone, role } = req.body

    try {
      // Kiểm tra xem email đã được đăng ký trước đó hay chưa
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(409).json({ message: 'Email đã tồn tại' })
      }

      // Hash password trước khi lưu vào database
      const hashedPassword = await bcrypt.hash(password, 10)

      // Tạo mới một user và lưu vào database
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        gender,
        birthday,
        address,
        phone,
        role,
      })

      return res.status(201).json({ message: 'Tạo tài khoản thành công', user: newUser })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Server error' })
    }
  },

  login: async (req, res) => {
    // Lấy dữ liệu từ body của request
    const { email, password, role } = req.body

    try {
      // Tìm user theo email
      const user = await User.findOne({ where: { email } })
      if (!user || user.role !== role) {
        return res.status(401).json({
          message: 'Thông tin tài khoản hoặc mật khẩu không chính xác',
        })
      }
      // Kiểm tra xem password có đúng không bằng cách so sánh với hashed password trong database
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({
          message: 'Thông tin tài khoản hoặc mật khẩu không chính xác',
        })
      }

      // Tạo JWT token
      const token = jwt.sign({ userId: user.id, role: role }, process.env.JWT_SECRET, {
        expiresIn: '5h',
      })

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        birthday: user.birthday,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        token,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Server error' })
    }
  },

  //Đổi thành getProfile: xem thông tin cá nhân của user
  getProfile: async (req, res, next) => {
    let payload = getPayload(req);
    let id = req.params.id;
    if (parseInt(payload.userId) !== parseInt(id)) {
      return res.status(403).json({ message: "authorize false" });
    }
    let user = await User.findByPk(id)
    return res.status(200).json(user)
  },

  updateUser: async (req, res, next) => {
    try {
      let payload = getPayload(req);
      let id = req.params.id;
      if (parseInt(payload.userId) !== parseInt(id)) {
        return res.status(403).json({ message: "authorize false" });
      }
      let { name, gender, birthday, address, phone, avatar } = req.body
      let user = await User.findByPk(id)
      if (!user) {
        return res.status(404).json({ message: 'Can not find user' })
      }
      await user.update({ name, gender, birthday, address, phone, avatar })
      return res.status(200).json(user)
    } catch (error) {
      console.log(error)
    }
  },
  //Admin page
  getUserById: async (req, res, next) => {
    let id = req.params.id
    let user = await User.findByPk(id)
    return res.status(200).json(user)
  },

  getAllUser: async (req, res, next) => {
    let user = await User.findAll({})
    return res.status(200).json(user)
  },

  getUserByName: async (req, res, next) => {
    const name = req.params.name
    try {
      const users = await User.find({ name }).exec() // exec() check chuỗi có chứa chuỗi con khớp với mô hình chuỗi của biểu thức chính quy
      res.json(users)
    } catch (error) {
      console.error(error)
      res.status(500).send('Lỗi server')
    }
  },

  getUserByPhoneNumber: async (req, res, next) => {
    const phone = req.params.phone
    try {
      const users = await User.find({ phone }).exec()
      res.json(users)
    } catch (error) {
      console.error(error)
      res.status(500).send('Lỗi server')
    }
  },
}

module.exports = userController
