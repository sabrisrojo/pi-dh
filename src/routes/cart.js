const path = require("path")
const express = require("express")
const router = express.Router()

const cartController = require("../controllers/cart")
const { isUserLoggedIn } = require("../utils/validation/userLoggedIn")

router.get("/", cartController.getCart)
router.post("/", isUserLoggedIn, cartController.checkout)
router.post("/:productId", cartController.addProductToCart)
router.put("/:productId/quantity", cartController.increaseProductFromCart)
router.delete("/:productId/quantity", cartController.decreaseProductFromCart)
router.delete("/:productId", cartController.removeProductFromCart)

module.exports = router
