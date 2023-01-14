const { body } = require("express-validator")
const fse = require("fs-extra")

const validateImageUpload = [
  body("avatar")
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Please upload a file")
      }
      return true
    })
    .bail()
    .custom((value, { req }) => {
      const acceptedFileTypes = ["image/jpeg", "image/png"]
      if (!acceptedFileTypes.includes(req.file.mimetype)) {
        fse.unlinkSync(req.file.path)
        throw new Error("Please upload a JPEG or PNG file")
      }
      return true
    })
    .bail()
    .custom((value, { req }) => {
      if (req.file.size > 1000000) {
        fse.unlinkSync(req.file.path)
        throw new Error("Please upload a file smaller than 1MB")
      }
      return true
    }),
]

module.exports = validateImageUpload
