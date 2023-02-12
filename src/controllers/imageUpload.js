const multer = require("multer")
const path = require("path")
// const storage = multer.memoryStorage()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/avatars")
  },
  filename: function (req, file, cb) {
    cb(
      null,
      "avatar-" + req.session.user.userId + path.extname(file.originalname)
    )
  },
})
const upload = multer({ storage: storage }).single("avatar")

const uploadAvatarImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading.")
      console.log(err)
    } else if (err) {
      console.log("An unknown error occurred when uploading.")
      console.log(err)
    }
    next()
  })
}

module.exports = { uploadAvatarImage }
