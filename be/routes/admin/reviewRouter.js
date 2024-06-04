const express = require('express')
const router = express.Router()
const { getUserReviewByProductId, createReview, deleteReview } = require('../../controller/reviewController')
const asyncHandle = require('../../middlewares/asyncHandle')

//Lấy tất cả thông tin về kích cỡ sản phẩm
router.route('/:productId').get(asyncHandle(getUserReviewByProductId))

//Lấy thông tin 1 kích cỡ sản phẩm theo id
router.route('/').post(asyncHandle(createReview))

router.route('/:id').delete(asyncHandle(deleteReview))

module.exports = router
