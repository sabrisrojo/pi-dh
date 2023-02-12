const { body } = require("express-validator")

const validateRegister = [
  body("username")
    .not()
    .isEmpty()
    .withMessage("Username é necessário")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Usuário precisa ter mais de 3 caractéres"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email é necessário")
    .bail()
    .isEmail()
    .withMessage("Digite um email válido"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Senha é necessário")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Senha precisa ter mais de 6 caractéres"),
]

module.exports = validateRegister
