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
const { blacklistToken } = require("../controllers/user.controller")

products.get("/getProducts",checkToken, getProduct, blacklistToken)

products.get("/getProducts:name", checkToken, getProductByName, blacklistToken)

products.post("/createProduct", blacklistToken, checkToken, validateProduct, createProduct)

products.put("/updateProduct", checkToken, validateProduct, updateProduct, blacklistToken)


module.exports = products