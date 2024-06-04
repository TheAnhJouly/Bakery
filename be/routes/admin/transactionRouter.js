const express = require('express')
const router = express.Router()
const {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransactionStatus,
  getOwnTransactionById,
  getTransactionByUserId,
  cancelTransaction,
} = require('../../controller/transactionController')
const asyncHandle = require('../../middlewares/asyncHandle')

router.route('/').get(asyncHandle(getAllTransactions))

router
  .route('/')
  // .get(asyncHandle(getAllSize))
  .post(asyncHandle(createTransaction))

//Lấy thông tin 1 kích cỡ sản phẩm theo id
router.route('/:id').get(asyncHandle(getOwnTransactionById))
// 	.get(asyncHandle(getSizeById))
// 	.patch(asyncHandle(updateSize))
// 	.delete(asyncHandle(deleteSize));

router.route('/user/:id').get(getTransactionByUserId)
router.route('/cancel/:id').patch(asyncHandle(cancelTransaction))

//Lấy thông tin 1 kích cỡ sản phẩm theo id
router.route('/:id').get(asyncHandle(getTransactionById)).patch(asyncHandle(updateTransactionStatus))
// 	.get(asyncHandle(getSizeById))
// 	.patch(asyncHandle(updateSize))
// 	.delete(asyncHandle(deleteSize));

module.exports = router
