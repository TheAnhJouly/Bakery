const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const categoryRouter = require('./categoryRouter')
const bigCategoryRouter = require('./bigCategoryRouter')
const typeRouter = require('./typeRouter')
const transactionRouter = require('./transactionRouter')
const carouselRouter = require('./carouselRouter')
const userReview = require('./reviewRouter')

const errorHandle = require('../middlewares/errorHandle')
const authenFilter = require('../middlewares/authenFilter')

module.exports = (app) => {
  app.use(authenFilter)
  app.use('/api/auth', userRouter)
  app.use('/api/products', productRouter)
  app.use('/api/categories', categoryRouter)
  app.use('/api/bigcategories', bigCategoryRouter)
  app.use('/api/types', typeRouter)
  app.use('/api/carousels', carouselRouter)
  app.use('/api/transactions', transactionRouter)
  app.use('/api/reviews', userReview)
  app.use('/api/payment', require('./payment'))
  app.use('/api/admin', require('./admin/index'))
  app.use(errorHandle)

  // not found
  app.get('*', function (req, res) {
    return res.status(404).json({
      success: false,
      data: 'API not found',
    })
  })
}
