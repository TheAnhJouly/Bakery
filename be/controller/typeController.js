const db = require('../models')
const type = db.models.Type
const BigCategory = db.models.BigCategory
const Category = db.models.Category

const typeController = {
  getAllType: async (req, res, next) => {
    let Type = await type.findAll({})
    return res.status(200).json(Type)
  },
  getAllTypeTree: async (req, res, next) => {
    try {
      const typeTree = await type.findAll({
        attributes:['id','name'],
        include: [
          {
            model: BigCategory,
            attributes: ['id', 'name'],
            include: [
              {
                model: Category,
                attributes: ['id', 'name'], 
              },
            ],
          },
        ],
      })
      return res.status(200).json(typeTree)
    } catch (e) {
      console.log(e);
      res.status(500).send('error database')
    }
  },
  getTypeById: async (req, res, next) => {
    try {
      const Type = await type.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: BigCategory,
            attributes: ['id', 'name'],
            include: [{ model: Category, attributes: ['id', 'name'] }],
          },
        ],
      })
      return res.status(200).json(Type)
    } catch (err) {
      res.status(500).send('error database')
    }
  },

  createType: async (req, res, next) => {
    console.log('ok')
    let { name } = req.body
    try {
      let Type = await type.create({ name })
      return res.status(201).json(Type)
    } catch (e) {
      console.log(e)
    }
  },

  updateType: async (req, res, next) => {
    let id = req.params.id
    let { ...body } = req.body
    let Type = await type.findByPk(id)
    if (!Type) {
      return res.status(404).json({ message: 'Can not find type' })
    }
    await Type.update(body)
    return res.status(200).json(Type)
  },
  deleteType: async (req, res, next) => {
    let id = req.params.id
    let Type = await type.findByPk(id)
    if (!Type) {
      return res.status(404).json({ message: 'Can not find type' })
    }
    await Type.destroy()
    return res.status(200).json({ message: 'Type deleted' })
  },
}

module.exports = typeController
