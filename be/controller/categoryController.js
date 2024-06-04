const db = require('../models')
const category = db.models.Category
const bigcategory = db.models.BigCategory

const categoryController = {
  getAllCategory: async (req, res, next) => {
    let categories = await category.findAll({})
    return res.status(200).json(categories)
  },
  getCategoryById: async (req, res, next) => {
    let id = req.params.id
    let Category = await category.findOne({
      where: { id: id },
      include: {
        model: bigcategory,
        attributes: ['name'],
      },
    })
    return res.status(200).json(Category)
  },
  getCategoryByBigCategory: async (req, res, next) => {
    const bigCategoryId = req.params.bigCategoryId
    try {
      const category = await db.models.Category.findAll({
        where: { bigCategoryId: bigCategoryId },
        // include: [{ model: Category }],
      })
      res.json(category)
    } catch (err) {
      res.status(500).send('Internal Server Error')
    }
  },
  createCategory: async (req, res, next) => {
    let { ...body } = req.body
    let Category = await category.create(body)
    return res.status(201).json(Category)
  },
  updateCategory: async (req, res, next) => {
    let id = req.params.id
    let { ...body } = req.body
    let Category = await category.findByPk(id)
    if (!Category) {
      return res.status(404).json({ message: 'Can not find category' })
    }
    await Category.update(body)
    return res.status(200).json(Category)
  },
  deleteCategory: async (req, res, next) => {
    let id = req.params.id
    let Category = await category.findByPk(id)
    if (!Category) {
      return res.status(404).json({ message: 'Can not find category' })
    }
    await Category.destroy()
    return res.status(200).json({ message: 'Category deleted' })
  },

  getCategoryByName: async (req, res, next) => {
    let keyword = req.query.name
    try {
      let Category = await category.findAll({
        where: {
          name: {
            [Op.like]: '%' + keyword + '%',
          },
        },
      })
      res.json(Category)
    } catch (error) {
      res.status(500).send('Internal server error')
    }
  },
}

module.exports = categoryController
