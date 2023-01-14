const path = require("path")
const express = require("express")
const router = express.Router()

const indexController = require("../controllers/index")
const usersController = require("../controllers/users")
const imageUploadController = require("../controllers/imageUpload")

const validateRegister = require("../utils/validation/register")
const validateLogin = require("../utils/validation/login")
const validateImageUpload = require("../utils/validation/imageUpload")

router.get("/login", usersController.login.get)

router.post("/login", validateLogin, usersController.login.post)

router.get("/register", usersController.register.get)

router.post("/register", validateRegister, usersController.register.post)

router.get("/image", usersController.upload.get)

router.post(
  "/image",
  imageUploadController.uploadAvatarImage,
  validateImageUpload,
  usersController.upload.post
)

module.exports = router
