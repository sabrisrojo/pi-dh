const path = require("path")
const express = require("express")
const router = express.Router()

const productsController = require("../controllers/products")

router.get("/", productsController.getAllProductsCategories)
router.get("/:query", productsController.getAllProductsByCategory)

module.exports = router
