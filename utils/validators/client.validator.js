const {check} = require("express-validator")
const {validateResult} = require("../helper/validate.helper")

const validateClient = [
    check("name","el campo no puede estar vacio").not().isEmpty(),
    check("name","solo se admiten letras").matches(/^[a-zA-Z\s]+$/),
    (req, res, next) =>{
        validateResult(req, res, next)
    }
]

module.exports = {
    validateClient
}