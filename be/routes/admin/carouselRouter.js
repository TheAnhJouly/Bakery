const express = require('express')
const router = express.Router()
const { createCarousel, getAllCarousel, deleteCarousel } = require('../../controller/carouselController')
const asyncHandle = require('../../middlewares/asyncHandle')

router.route('/').post(asyncHandle(createCarousel)).get(asyncHandle(getAllCarousel))

router.route('/:id').delete(asyncHandle(deleteCarousel))

module.exports = router
