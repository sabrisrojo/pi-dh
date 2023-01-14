const path = require("path")
const express = require("express")
const router = express.Router()

const indexController = require("../controllers/index")
const usersController = require("../controllers/users")
const fileUploadController = require("../controllers/fileUpload")

router.get("/", indexController.index.get)
router.post("/", indexController.index.post)
router.put("/", indexController.index.put)
router.delete("/", indexController.index.delete)

module.exports = router
