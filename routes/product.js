const express = require("express")
const products = express.Router()
const {validateProduct} = require("../middlewares/validators/product.validator")
const {checkToken} = require("../middlewares/jwt/checkToken")
const {
    getProduct,
    getProductByName,
    createProduct,
    updateProduct
} = require("../controllers/product.controller")

products.get("/getProducts", checkToken, getProduct)

products.get("/getProducts:name", checkToken, getProductByName)

products.post("/createProduct", checkToken, validateProduct, createProduct)

products.put("/updateProduct", checkToken, validateProduct, updateProduct)


module.exports = products