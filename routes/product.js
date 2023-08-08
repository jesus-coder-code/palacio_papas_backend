const express = require("express")
const products = express.Router()
const multer = require("multer")
const upload = multer()

const {validateProduct} = require("../utils/validators/product.validator")
//const {requireRole} = require("../utils/auth/auth")
const {checkToken, hasRole, verifyToken} = require("../utils/jwt/checkToken")
const {
    getProduct,
    getProductByName,
    createProduct,
    updateProduct,
    newTravel,
    getTravel,
    deleteTravel,
    getTravelByDate,
    
} = require("../controllers/product.controller")
//const { blacklistToken } = require("../controllers/user.controller")

products.get("/getProducts",checkToken,verifyToken, hasRole('Admin'), getProduct)

products.get("/getProducts/:name",checkToken, verifyToken, hasRole('Admin'),getProductByName)

products.post("/createProduct", checkToken, verifyToken, hasRole('Admin'),upload.any('image', 1),createProduct)

products.put("/updateProduct/:id",checkToken, verifyToken, hasRole('Admin'), upload.any('image', 1),updateProduct)

products.post("/travel/newTravel", checkToken, verifyToken, hasRole('Kitchen'), newTravel)

products.get("/travel/getTravelByDate/:date", checkToken, verifyToken, getTravelByDate)

products.get("/travel/getTravel", checkToken, verifyToken, getTravel)

products.delete("/travel/deleteTravel/:id", checkToken, verifyToken, hasRole('Kitchen'), deleteTravel)

module.exports = products