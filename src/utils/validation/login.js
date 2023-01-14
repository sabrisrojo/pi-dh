const { body } = require("express-validator")

const validateLogin = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Username is at least 3 chars long"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password is at least 6 chars long"),
]

module.exports = validateLogin
