const express = require('express')
const router = express.Router()
const { register, login, getProfile, updateUser } = require('../controller/userController')
const asyncHandle = require('../middlewares/asyncHandle')

// Đăng ký
router.route('/register').post(asyncHandle(register))

// Đăng nhập
router.route('/login').post(asyncHandle(login))

router.route('/:id').patch(asyncHandle(updateUser))

// Lấy thông tin 1 user theo id, update thông tin user có id
router.route('/:id').get(asyncHandle(getProfile))

module.exports = router
