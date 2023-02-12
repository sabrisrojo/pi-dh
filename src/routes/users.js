const path = require("path")
const express = require("express")
const router = express.Router()

const indexController = require("../controllers/index")
const usersController = require("../controllers/users")
const imageUploadController = require("../controllers/imageUpload")

const validateRegister = require("../utils/validation/register")
const validateLogin = require("../utils/validation/login")
const validateImageUpload = require("../utils/validation/imageUpload")
const { isUserLoggedIn } = require("../utils/validation/userLoggedIn")

router.get("/login", isUserLoggedIn, usersController.login.get)

router.post("/login", validateLogin, usersController.login.post)

router.get("/register", isUserLoggedIn, usersController.register.get)

router.post("/register", validateRegister, usersController.register.post)

router.delete("/register/:id", usersController.register.delete)

router.post(
  "/image",
  isUserLoggedIn,
  imageUploadController.uploadAvatarImage,
  validateImageUpload,
  usersController.upload.post
)

router.get("/history", isUserLoggedIn, usersController.getHistory)

router.get("/history/:id", isUserLoggedIn, usersController.getOrderDetail)

router.get(
  "/history/:id/shipping",
  isUserLoggedIn,
  usersController.getOrderShipping
)
router.put(
  "/history/:id/shipping",
  isUserLoggedIn,
  usersController.updateOrderShipping
)

router.get(
  "/history/:id/payment",
  isUserLoggedIn,
  usersController.getOrderPayment
)
router.put(
  "/history/:id/payment",
  isUserLoggedIn,
  usersController.updateOrderPayment
)

router.get(
  "/history/:id/review",
  isUserLoggedIn,
  usersController.getOrderConfirmation
)
router.put("/history/:id/review", isUserLoggedIn, usersController.finishOrder)

router.delete(
  "/history/:id/review",
  isUserLoggedIn,
  usersController.deleteOrder
)

router.get("/profile", isUserLoggedIn, usersController.getProfile)

router.put("/profile", isUserLoggedIn, usersController.updateProfile)

router.get("/logout", isUserLoggedIn, usersController.logoutCurrentUser)

module.exports = router
