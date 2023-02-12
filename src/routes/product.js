const path = require("path")
const express = require("express")
const router = express.Router()

const productsController = require("../controllers/products")

router.get("/", productsController.getAllProducts)
router.get("/search", productsController.getProductByProductName)
router.get("/:id", productsController.getOneProductById)

module.exports = router
