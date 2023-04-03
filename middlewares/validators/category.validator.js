const { check } = require("express-validator");
const { validateResult } = require("../helper/validate.helper");

const validateCategory = [
  check("name", "este campo no puede estar vacio").not().isEmpty(),
  check("name", "este campo no puede ser de numeros").not().isNumeric(),
  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateCategory,
};