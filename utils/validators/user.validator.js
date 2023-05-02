const { check } = require("express-validator");
const { validateResult } = require("../helper/validate.helper");

const validateUser = [
  check("username", "indique un usuario").not().isEmpty(),
  check("password", "el campo contraseña no puede estar vacio").not().isEmpty(),
  check("password", "la contraseña debe ser de minimo 8 caracteres").isLength({
    min: 8,
  }),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateUser,
};