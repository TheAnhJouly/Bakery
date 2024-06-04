const slug = require('slug')
const db = require('../models')
const { Op } = require('sequelize')
const Sequelize = require('sequelize')
const product = db.models.Product
const Category = db.models.Category
const bigCategory = db.models.BigCategory
const productController = {
  //done
  getAllProduct: async (req, res, next) => {
    // const limit = 12
    // const page = req.params.page || 1
    // const offset = (page - 1) * limit
    let products = []
    try {
      products = await product.findAll({
        // limit: limit,
        // offset: offset,
        include: [
          {
            model: db.models.Category,
            attributes: ['id', 'name'],
          },
        ],
        paranoid: false, // paranoid để bao gồm các sản phẩm đã xóa
      })
    } catch (error) {
      console.log(error)
    }
    return res.status(200).json(products)
  },

  //done
  getProductById: async (req, res, next) => {
    let id = req.params.id
    const products = await product.findOne({
      where: { id: id },
      paranoid: false,
    })

    return res.status(200).json(products)
  },

  //done
  createProduct: async (req, res, next) => {
    try {
      let { ...body } = req.body
      const newSlug = slug(req.body.name) // tv slug made string slug ( nodejs )
      let productInstance = await db.models.Product.create({
        ...body,
        slug: newSlug,
        saleCount: 0,
      })

      
      return res.status(201).json(productInstance)
    } catch (error) {
      console.log(error)
    }
  },

  //done
  updateProduct: async (req, res, next) => {
    let id = req.params.id
    let { ...body } = req.body
    let product = await db.models.Product.findByPk(id)
    if (!product) {
      res.status(404).send('Cannot find product')
    }
    try {
      await product.update(body)
      res.status(200).send('Product updated successfully')
    } catch (error) {
      console.log(error)
    }
  },

  //fix
  findProductByCategory: async (req, res, next) => {
    let categoryid = +req.params.categoryid // trích id từ ts  
    let { sizeCodes, priceRanges, sort } = req.query
    const query = {}
    const condition = {
      categoryId: categoryid,
    }
    if (sizeCodes) {
      const sizes = sizeCodes.split(',')
      if (sizes.length)
        query.include = [
          {
            model: size,
            where: { name: sizes },
          },
        ]
    }
    if (priceRanges) {
      const prices = priceRanges.split('-')
      let startPrice = parseInt(prices[0])
      if (!startPrice) startPrice = 0
      condition.price[Op.gt] = startPrice
      if (prices.length == 2 && parseInt(prices[1])) condition.price[Op.lt] = parseInt(prices[1])
      query.where = condition
    }
    query.where = condition // update the condition object
    if (sort) {
      switch (parseInt(sort)) {
        case 1:
          query.order = [['price', 'ASC']]
          break
        case 2:
          query.order = [['price', 'DESC']]
          break
        case 3:
          query.order = [['createdAt', 'DESC']]
          break
        default:
          break
      }
    }
    try {
      const products = await product.findAll({ ...query })
      return res.status(200).json(products)
    } catch (e) {
      console.log(e)
      res.status(500)
    }
  },

  findProductByBigCategory: async (req, res, next) => {
    try {
      let bigcategoryid = req.params.bigcategoryid
      let categories = await Category.findAll({
        where: { bigcategoryId: bigcategoryid },
      })
      let categoryIds = categories.map((c) => c.id)
      let products = await product.findAll({
        where: { categoryId: categoryIds },
      })
      return res.status(200).json(products)
    } catch (error) {
      console.log(error)
    }
  },

  findProductByType: async (req, res, next) => {
    let typeid = req.params.typeid
    let bigcategories = await bigCategory.findAll({
      where: { typeId: typeid },
    })
    let bigcategoryIds = bigcategories.map((c) => c.id)
    let categories = await Category.findAll({
      where: { bigcategoryId: bigcategoryIds },
    })
    let categoryIds = categories.map((c) => c.id)
    let products = await product.findAll({
      where: { categoryId: categoryIds },
    })
    return res.status(200).json(products)
  },

  deleteProduct: async (req, res, next) => {
    let id = req.params.id
    let Product = await product.findByPk(id)
    if (!Product) {
      res.status(404).send('Cannot find product')
    }
    await Product.destroy()
    res.status(200).send('Product deleted successfully')
  },

  //done
  getProductByName: async (req, res, next) => {
    let name = req.query.name
    try {
      let products = await product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      })
      return res.status(200).json(products)
    } catch (error) {
      console.error(error)
      res.status(500).send('error server')
    }
  },

  //done
  getNewestProducts: async (req, res, next) => {
    let amount = parseInt(req.query.amount)
    if (!amount) amount = 10
    try {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

      const products = await product.findAll({
        where: {
          createdAt: {
            [Op.between]: [oneMonthAgo, new Date()],
          },
        },
        order: [['createdAt', 'DESC']],
        limit: amount,
      })
      return res.status(200).json(products)
    } catch (e) {
      console.log(e)
      res.status(500).send('error server')
    }
  },

  //done
  getBestSeller: async (req, res, next) => {
    let amount = parseInt(req.query.amount)
    if (!amount) amount = 10
    try {
      const products = await db.models.Product.findAll({
        order: [['saleCount', 'DESC']],
        limit: amount,
      })

      return res.status(200).json(products)
    } catch (e) {
      console.log(e)
      res.status(500).send('error server')
    }
  },

  //done
  getOutOfStockItems: async (req, res, next) => {
    let limit = parseInt(req.query.limit)
    if (!limit) limit = 5
    try {
      const products = await db.models.Product.findAll({
        where: {
          quantity: {
            [Sequelize.Op.lt]: 10, // Quantity should be under 10
          },
        },
        order: [['quantity', 'ASC']],
        limit: limit,
      })

      res.json(products)
    } catch (e) {
      console.log(e)
      res.status(500).send('error server')
    }
  },
  //LỌC SẢN PHẨM  
  filterProduct: async (req, res, next) => {
    let { sizeCodes, priceRanges, sort } = req.query
    const query = {}
    const condition = {
      price: {},
    }
    if (sizeCodes) {
      const sizes = sizeCodes.split(',')
      if (sizes.length)
        query.include = [
          {
            model: size,
            where: { name: sizes },
          },
        ]
    }
    if (priceRanges) {
      const prices = priceRanges.split('-')
      let startPrice = parseInt(prices[0])
      if (!startPrice) startPrice = 0
      condition.price[Op.gt] = startPrice
      if (prices.length == 2 && parseInt(prices[1])) condition.price[Op.lt] = parseInt(prices[1])
      query.where = condition
    }
    if (sort) {
      switch (parseInt(sort)) {
        case 1:
          query.order = [['price', 'ASC']]
          break
        case 2:
          query.order = [['price', 'DESC']]
          break
        case 3:
          query.order = [['createdAt', 'DESC']]
          break
        default:
          break
      }
    }
    try {
      const products = await product.findAll({ ...query })
      return res.status(200).json(products)
    } catch (e) {
      console.log(e)
      res.status(500)
    }
  },
}

module.exports = productController
