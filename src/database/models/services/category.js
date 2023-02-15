const { Category } = require("../models")
const { Sequelize } = require("sequelize")
const config = require("../../config")
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
  }
)

const categoryService = {
  getAllCategories: async () => {
    try {
      const categories = await Category.findAll()
      return categories
    } catch (err) {
      throw err
    }
  },
  getThreeCategoriesAtRandom: async () => {
    try {
      const categories = await Category.findAll({
        limit: 3,
        order: sequelize.random(),
      })
      return categories
    } catch (err) {
      throw err
    }
  },
}

module.exports = categoryService
