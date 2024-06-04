const db = require('../models')
const bigcategory = db.models.BigCategory
const Category = db.models.Category

const bigCategoryController = {
  getAllBigCategory: async (req, res, next) => {
    let bigcategories = await bigcategory.findAll({})
    return res.status(200).json(bigcategories)
  },
  getBigCategoryById: async (req, res, next) => {
    try {
      const BigCategory = await bigcategory.findOne({
        where: { id: req.params.id },
        include: [{ model: Category }],
      })
      res.json(BigCategory)
    } catch (err) {
      res.status(500).send('Internal Server Error')
    }
    return res.status(200).json(BigCategory)
  },
  getBigCategoryByType: async (req, res, next) => {
    const typeId = req.params.typeId
    try {
      const BigCategory = await bigcategory.findAll({
        where: { typeId: typeId },
        // include: [{ model: Category }],
      })
      res.json(BigCategory)
    } catch (err) {
      res.status(500).send('Internal Server Error')
    }
  },
  createBigCategory: async (req, res, next) => {
    let { ...body } = req.body
    let BigCategory = await bigcategory.create(body)
    return res.status(201).json(BigCategory)
  },
  updateBigCategory: async (req, res, next) => {
    let id = req.params.id
    let { ...body } = req.body
    let BigCategory = await bigcategory.findByPk(id) // phương thức findByPk 
    if (!BigCategory) {
      return res.status(404).json({ message: 'Can not find big category' })
    }
    await BigCategory.update(body)
    return res.status(200).json(BigCategory)
  },
  deleteBigCategory: async (req, res, next) => {
    let id = req.params.id
    let BigCategory = await bigcategory.findByPk(id)
    if (!BigCategory) {
      return res.status(404).json({ message: 'Can not find big category' })
    }
    await BigCategory.destroy()
    return res.status(200).json({ message: 'Big category deleted' })
  },
}

module.exports = bigCategoryController
