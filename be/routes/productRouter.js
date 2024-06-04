const express = require('express')
const router = express.Router()
const {
  getAllProduct,
  getProductById,
  getProductByName,
  findProductByCategory,
  findProductByBigCategory,
  findProductByType,
  getNewestProducts,
  getBestSeller,
  filterProduct,
} = require('../controller/productController')
const asyncHandle = require('../middlewares/asyncHandle')

//Lấy tất cả thông tin sản phẩm
router.route('/').get(asyncHandle(getProductByName))

//Lấy x sản phẩm mới nhất trong vòng 1 tháng
router.route('/newest').get(asyncHandle(getNewestProducts))
//
router.route('/bestseller').get(asyncHandle(getBestSeller))

router.route('/filter').get(asyncHandle(filterProduct))
//Lấy thông tin 1 sản phẩm theo id
router.route('/:id').get(asyncHandle(getProductById))

// Lấy thông tin của product
router.route('/page/:page').get(asyncHandle(getAllProduct))

//Lấy thông tin sản phẩm theo category
router.route('/category/:categoryid').get(asyncHandle(findProductByCategory))

//Lấy thông tin sản phẩm theo bigcategory
router.route('/bigcategory/:bigcategoryid').get(asyncHandle(findProductByBigCategory))

//Lấy thông tin sản phẩm theo type
router.route('/type/:typeid').get(asyncHandle(findProductByType))
module.exports = router
