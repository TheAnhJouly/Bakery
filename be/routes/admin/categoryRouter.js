const express = require('express')
const router = express.Router()
const {
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryByName,
  getCategoryByBigCategory,
} = require('../../controller/categoryController')
const asyncHandle = require('../../middlewares/asyncHandle')

router.route('/').get(asyncHandle(getAllCategory))

//Lấy thông tin 1 loại theo id
router.route('/:id').get(asyncHandle(getCategoryById))

router.route('/bigCategory/:bigCategoryId').get(asyncHandle(getCategoryByBigCategory))

router.route('/search').get(asyncHandle(getCategoryByName))

//Lấy tất cả thông tin loại
router.route('/').post(asyncHandle(createCategory))

//Lấy thông tin 1 loại theo id
router.route('/:id').patch(asyncHandle(updateCategory)).delete(asyncHandle(deleteCategory))

module.exports = router
