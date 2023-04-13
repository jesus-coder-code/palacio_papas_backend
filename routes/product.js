const express = require("express")
const products = express.Router()
const {validateProduct} = require("../utils/validators/product.validator")
//const {requireRole} = require("../utils/auth/auth")
const {checkToken, hasRole, verifyToken} = require("../utils/jwt/checkToken")
const {
    getProduct,
    getProductByName,
    createProduct,
    updateProduct
} = require("../controllers/product.controller")
//const { blacklistToken } = require("../controllers/user.controller")

products.get("/getProducts",checkToken,verifyToken, hasRole('Admin'), getProduct)

products.get("/getProducts:name",checkToken, verifyToken, hasRole('Admin'),getProductByName)

products.post("/createProduct", checkToken, verifyToken, hasRole('Admin'),createProduct)

products.put("/updateProduct",checkToken, validateProduct, updateProduct)


module.exports = products