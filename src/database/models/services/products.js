const { Product } = require("../models")
const { Sequelize, Op } = require("sequelize")
const config = require("../../config")
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
  }
)

const productsService = {
  getAllProducts: async () => {
    try {
      const products = await Product.findAll()
      return products
    } catch (err) {
      throw err
    }
  },
  searchProductsByName: async (name) => {
    try {
      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: "%" + name + "%",
          },
        },
      })
      return products
    } catch (err) {
      throw err
    }
  },
  getOneProduct: async (id) => {
    try {
      const product = await Product.findOne({
        where: {
          id: id,
        },
      })
      return product
    } catch (err) {
      throw err
    }
  },
  getOneProductPyProductId: async (productId) => {
    try {
      const product = await Product.findOne({
        where: {
          productId: productId,
        },
      })
      return product
    } catch (err) {
      throw err
    }
  },
  getAllProductsByCategoryName: async (categoryName) => {
    try {
      const products = await Product.findAll({
        where: {
          category: categoryName,
        },
      })
      return products
    } catch (err) {
      throw err
    }
  },
  getTwoProductsOfSameCategoryAtRandom: async (id, categoryName) => {
    try {
      const products = await Product.findAll({
        where: {
          id: {
            [Op.ne]: id,
          },
          category: categoryName,
        },
        order: sequelize.random(),
        limit: 2,
      })
      return products
    } catch (err) {
      throw err
    }
  },
  getFiveProductsAtRandom: async () => {
    try {
      const products = await Product.findAll({
        order: sequelize.random(),
        limit: 5,
      })
      return products
    } catch (err) {
      throw err
    }
  },
  getTwoProductsOfSameCategoryAtRandom: async (id, categoryName) => {
    try {
      const products = await Product.findAll({
        where: {
          id: {
            [Op.ne]: id,
          },
          category: categoryName,
        },
        order: sequelize.random(),
        limit: 2,
      })
      return products
    } catch (err) {
      throw err
    }
  },
}

module.exports = productsService
