const { body } = require("express-validator")

const validateLogin = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Usuário é necessário")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Usuário precisa ter mais de 3 caractéres"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Senha é necessária")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Senha precisa ter mais de 6 caractéres"),
]

module.exports = validateLogin
