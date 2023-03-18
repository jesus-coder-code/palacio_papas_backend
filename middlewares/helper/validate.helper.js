const { validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (error) {
    res.status(422);
    res.json({ message: error.array() });
    console.log(error);
  }
};

module.exports = {
  validateResult,
};