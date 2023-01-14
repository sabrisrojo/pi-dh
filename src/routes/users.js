const path = require("path")
const express = require("express")
const router = express.Router()

const usersController = require("../controllers/users")
const fileUploadController = require("../controllers/fileUpload")

router.get("/login", usersController.login.get)

router.post("/login", usersController.login.post)

router.get("/register", usersController.register.get)

router.post("/register", usersController.register.post)

router.get("/image", usersController.upload.get)

router.post(
  "/image",
  fileUploadController.uploadAvatarImage,
  usersController.upload.post
)

module.exports = router
