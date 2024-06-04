const db = require('../models')
const userReview = db.models.UserReview

function getReceivedProductIds(apiResponse) {
  const receivedProductIds = []

  apiResponse.forEach((transaction) => {
    if (transaction.deliveryStatus === 'received') {
      transaction.products.forEach((productData) => {
        receivedProductIds.push(productData.id)
      })
    }
  })

  return receivedProductIds
}

const userReviewController = {
  //done
  getUserReviewByProductId: async (req, res, next) => {
    const productId = req.params.productId
    try {
      let reviews = await db.models.UserReview.findAll({
        where: {
          productId: productId,
        },
      })
      for (const review of reviews) {
        const user = await db.models.User.findOne({ where: { id: review.userId } })
        review.userId = {
          name: user.name,
          avatar: user.avatar,
        }
      }

      return res.status(200).json(reviews)
    } catch (error) {
      console.log('error', error)
      return res.status(500).json({ error: 'Server error' })
    }
  },

  //donne 7/5
  createReview: async (req, res, next) => {
    let { rate, comment, productId, userId } = req.body
    const dataFind = await userReview.findOne({ where: { userId: userId, productId: productId } })
    if (dataFind) throw new Error('You only can comment on this product 1 time')
    try {
      //check that user has bought it or not
      const transactionData = await db.models.Transaction.findAll({
        where: { userId: userId },
        include: {
          model: db.models.Product,
          attributes: ['id'],
          // include: [
          //   {
          //     model: db.models.Product,
          //     attributes: ['id', 'name', 'coverImage', 'price', 'salePrice'],
          //     paranoid: false,
          //   },
          // ],
        },
        order: [['createdAt', 'DESC']],
      })
      const productIds = getReceivedProductIds(transactionData)
      if (!productIds.includes(productId)) throw new Error('Please buy this product to review')
      const reviewData = await userReview.create({ rate, comment, productId, userId })
      return res.status(201).json(reviewData)
    } catch (error) {
      console.log(error)
    }
  },

  deleteReview: async (req, res, next) => {
    let id = parseInt(req.params.id)
    try {
      let review = await userReview.findByPk(id)
      if (!review) {
        return res.status(404).json({ message: 'Can not find review' })
      }
      await review.destroy()
      return res.status(200).json({ message: 'Review deleted' })
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = userReviewController
