const express = require('express')
const router = express.Router()
const { getAllCarousel } = require('../controller/carouselController')
const asyncHandle = require('../middlewares/asyncHandle')

router.route('/').get(asyncHandle(getAllCarousel))

module.exports = router
