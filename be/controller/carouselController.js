const db = require('../models')
const carousel = db.models.Carousel

const carouselController = {
  getAllCarousel: async (req, res, next) => {
    let carousels = await carousel.findAll({})
    return res.status(200).json(carousels)
  },
  createCarousel: async (req, res, next) => {
    let {image,name} = req.body
    try {
      const carouselData = await carousel.create({ image,name })
      return res.status(201).json(carouselData)
    } catch (error) {
      console.log(error)
    }
  },
  //not done yet
  // updateCarousel: async (req, res, next) => {
  //   let id = req.params.id
  //   let { ...body } = req.body
  //   let carouselSearch = await carousel.findByPk(id)
  //   if (!carouselSearch) {
  //     return res.status(404).json({ message: 'Can not find carousel' })
  //   }
  //   await carousel.update(body)
  //   return res.status(200).json(carouselSearch)
  // },
  deleteCarousel: async (req, res, next) => {
    let id = parseInt(req.params.id)
    let carouselFind = await carousel.findByPk(id)
    if (!carouselFind) {
      return res.status(404).json({ message: 'Can not find carousel' })
    }
    await carouselFind.destroy()
    return res.status(200).json({ message: 'Carousel deleted' })
  },
}

module.exports = carouselController
