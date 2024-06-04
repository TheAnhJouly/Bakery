const express = require('express')
const router = express.Router()
const {
  getAllBigCategory,
  createBigCategory,
  getBigCategoryById,
  updateBigCategory,
  deleteBigCategory,
  getBigCategoryByType,
} = require('../../controller/bigCategoryController')
const asyncHandle = require('../../middlewares/asyncHandle')

router.route('/').get(asyncHandle(getAllBigCategory))
//Lấy thông tin 1 loại lớn theo id
router.route('/:id').get(asyncHandle(getBigCategoryById))

router.route('/type/:typeId').get(getBigCategoryByType)

//Lấy tất cả thông tin loại lớn
router.route('/').post(asyncHandle(createBigCategory))

//Lấy thông tin 1 loại lớn theo id
router.route('/:id').patch(asyncHandle(updateBigCategory)).delete(asyncHandle(deleteBigCategory))

module.exports = router
