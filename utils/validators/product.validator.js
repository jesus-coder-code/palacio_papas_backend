const {check} = require("express-validator")
const {validateResult} = require("../helper/validate.helper")

const validateProduct = [
    check("name","ingresa el nombre del producto").not().isEmpty(),
    check("type", "selecciona el tipo de producto (con o sin stock)").not().isEmpty(),
    check("name", "este campo no pueden ser numeros").not().isNumeric(),
    check("price","el campo de precio no puede estar vacio").not().isEmpty(),
    //check("stock", "ingrese la cantidad").not().isEmpty(),
    //check("stock", "este campo no pueden ser letras").isNumeric(),
    //check("category", "por favor seleccione una categoria").not().isEmpty(),
    (req, res, next) =>{
        validateResult(req, res, next)
    }
]

module.exports = {
    validateProduct,
}