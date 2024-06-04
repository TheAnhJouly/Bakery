const db = require('../models')
const jwt = require('jsonwebtoken')
const Transaction = db.models.Transaction
function getPayload(request) {
  const token = request.headers.authorization
  return jwt.verify(token, process.env.JWT_SECRET)
}
const transactionController = {
  //done 4/5
  getAllTransactions: async (req, res, next) => {
    // const limit = 12
    // const page = req.params.page || 1
    // const offset = (page - 1) * limit
    let transactions = []
    try {
      transactions = await Transaction.findAll({
        // limit: limit,
        // offset: offset,
        include: [
          {
            model: db.models.User,
            attributes: ['id', 'name', 'email', 'phone'],
          },
          {
            model: db.models.Product,
            attributes: ['id', 'name', 'price', 'salePrice', 'coverImage'],
          },
        ],

        order: [['createdAt', 'DESC']],
      })
    } catch (error) {
      console.log(error)
    }
    return res.status(200).json(transactions)
  },

  //done 5/4
  createTransaction: async (req, res, next) => {
    const { userId, productList, transactionMethod, description, totalPrice } = req.body

    try {
      for (const productItem of productList) {
        const productData = await db.models.Product.findOne({ where: { id: productItem.productId } })
        if (productData.quantity < productItem.quantity) {
          return res.status(400).json({ message: 'Quantity is out of stock' })
        }
      }
      const transaction = await Transaction.create({
        userId,
        totalPrice,
        transactionMethod,
        description,
      })
      const transactionProduct = []
      for (const productItem of productList) {
        const productData = await db.models.Product.findOne({ where: { id: productItem.productId } })
        transactionProduct.push({
          transactionId: transaction.id,
          productId: productItem.productId,
          quantity: productItem.quantity,
        })
        await db.models.Product.update(
          {
            saleCount: +productData.saleCount + +productItem.quantity ,
            quantity: +productData.quantity - +productItem.quantity,
          },
          { where: { id: productItem.productId } }
        )
      }

      await db.models.TransactionProduct.bulkCreate(transactionProduct)
      return res.status(200).json(transaction)
    } catch (err) {
      console.log(err)
    }
  },

  //ignore
  getTransactionById: async (req, res, next) => {
    const id = req.params.id
    try {
      let transactions = await Transaction.findOne({
        where: { id: id },
      })
      return res.status(200).json(transactions)
    } catch (error) {
      console.log(error)
    }
  },

  //ignore
  getOwnTransactionById: async (req, res, next) => {
    const id = req.params.id
    const payload = getPayload(req)
    try {
      let transactions = await Transaction.findOne({
        where: {
          id: id,
          userId: parseInt(payload.userId),
        },
        attributes: ['id', 'userId'],
        order: [['createdAt', 'DESC']],
      })
      return res.status(200).json(transactions)
    } catch (error) {
      console.log(error)
    }
  },

  //done 7/5
  updateTransactionStatus: async (req, res, next) => {
    let id = req.params.id
    const deliStatus = {
      confirmming: 0,
      init: 1,
      shipping: 2,
      received: 3,
      canceled: -1,
    }
    const { deliveryStatus, transactionMethod } = req.body
    try {
      const transaction = await Transaction.findOne({
        where: { id },
      })
      if (!transaction) {
        throw new ErrorResponse('Transaction not found', 404)
      }
      if (transaction.paymentstatus !== '1' && transaction.transactionMethod !== 'cash')
        return res.status(500).json({ message: 'Unpaid' })

      if (deliStatus[deliveryStatus] !== -1) {
        if (
          deliStatus[deliveryStatus] < deliStatus[transaction.deliveryStatus] ||
          deliStatus[deliveryStatus] - deliStatus[transaction.deliveryStatus] > 1
        ) {
          return res.status(500).json({ message: 'Can not roll back transaction status' })
        }
      }

      if (deliStatus[transaction.deliveryStatus] >= 2 && deliStatus[deliveryStatus] === -1) {
        return res.status(500).json({ message: 'Shipping, can not canceled' })
      }

      if (deliStatus[transaction.deliveryStatus] === -1) {
        return res.status(500).json({ message: 'Cannot update canceled transaction' })
      }

      let paymentstatus = transaction.paymentstatus
      if (deliStatus[deliveryStatus] === 3 && transactionMethod === 'cash') paymentstatus = '1'
      await transaction.update({
        deliveryStatus,
        transactionMethod,
        paymentstatus,
      })

      return res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        transaction,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },

  //done 7/5
  cancelTransaction: async (req, res, next) => {
    const id = req.params.id
    const payload = getPayload(req)
    try {
      let transaction = await Transaction.findOne({
        where: {
          id: id,
          userId: parseInt(payload.userId),
        },
        include: [
          {
            model: db.models.Product,
          },
        ],
      })
      for (const productItem of transaction.products) {
        await db.models.Product.update(
          {
            saleCount: +productItem.saleCount - +productItem.transaction_product.quantity,
            quantity: +productItem.quantity + +productItem.transaction_product.quantity,
          },
          { where: { id: productItem.id } }
        )
      }
      if (transaction.deliveryStatus !== 'confirmming' || transaction.deliveryStatus === 'canceled') {
        return res.status(500).json({ message: 'Can not cancel transaction' })
      }
      await transaction.update({ deliveryStatus: 'canceled' })
      return res.status(200).json({
        success: true,
        message: 'Transaction canceled successfully',
        transaction,
      })
    } catch (error) {
      console.log(error)
      return res.status(500)
    }
  },
  //done 7/5
  getTransactionByUserId: async (req, res, next) => {
    let id = req.params.id
    try {
      try {
        const transactions = await Transaction.findAll({
          where: { userId: id },
          include: [
            {
              model: db.models.Product,
              attributes: ['id', 'name', 'coverImage', 'price', 'salePrice'],
              paranoid: false,
              through: {
                attributes: ['quantity'],
              },
            },
          ],
          order: [['createdAt', 'DESC']],
        })
        return res.status(200).json(transactions)
      } catch (error) {
        console.log(error)
      }
    } catch (error) {}
  },
}

module.exports = transactionController
