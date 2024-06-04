const express = require('express')
const router = express.Router()
const {
  updateProduct,
  deleteProduct,
  createProduct,
  getProductByName,
  getNewestProducts,
  getBestSeller,
  filterProduct,
  getProductById,
  getAllProduct,
  findProductByCategory,
  findProductByBigCategory,
  findProductByType,
  getOutOfStockItems,
} = require('../../controller/productController')
const asyncHandle = require('../../middlewares/asyncHandle')

router.route('/').get(asyncHandle(getProductByName))

//Lấy x sản phẩm mới nhất trong vòng 1 tháng
router.route('/newest').get(asyncHandle(getNewestProducts))
//
router.route('/bestseller').get(asyncHandle(getBestSeller))

router.route('/outofstock').get(asyncHandle(getOutOfStockItems))

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

router.route('/').post(asyncHandle(createProduct))

//Lấy thông tin 1 sản phẩm theo id
router.route('/:id').patch(asyncHandle(updateProduct)).delete(asyncHandle(deleteProduct))
module.exports = router
