const path = require("path")
const express = require("express")
const router = express.Router()

const indexController = require("../controllers/index")
const usersController = require("../controllers/users")
const imageUploadController = require("../controllers/imageUpload")

router.get("/", indexController.index.get)
router.post("/", indexController.index.post)
router.put("/", indexController.index.put)
router.delete("/", indexController.index.delete)

router.get("/cookies", indexController.cookies.get)
router.post("/cookies", indexController.cookies.post)
router.put("/cookies", indexController.cookies.put)
router.delete("/cookies", indexController.cookies.delete)

router.get("/session", indexController.sessions.get)
router.post("/session", indexController.sessions.post)
router.put("/session", indexController.sessions.put)
router.delete("/session", indexController.sessions.delete)

module.exports = router
