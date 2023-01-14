const { body } = require("express-validator")

const validateRegister = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Username is at least 3 chars long"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Email is invalid"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password is at least 6 chars long"),
]

module.exports = validateRegister
