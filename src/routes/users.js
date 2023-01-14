const path = require("path")
const express = require("express")
const router = express.Router()

const indexController = require("../controllers/index")
const usersController = require("../controllers/users")
const fileUploadController = require("../controllers/fileUpload")

const validateRegister = require("../utils/validation/register")
const validateLogin = require("../utils/validation/login")

router.get("/login", usersController.login.get)

router.post("/login", validateLogin, usersController.login.post)

router.get("/register", usersController.register.get)

router.post("/register", validateRegister, usersController.register.post)

router.get("/image", usersController.upload.get)

router.post(
  "/image",
  fileUploadController.uploadAvatarImage,
  usersController.upload.post
)

module.exports = router
