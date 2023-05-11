const express = require("express");
const users = express.Router();
const {createUser, loginUser, logoutUser, updateUser} = require("../controllers/user.controller");
const { decodeToken, hasRole, checkToken, verifyToken } = require("../utils/jwt/checkToken");
const {validateUser} = require("../utils/validators/user.validator");
const { getProduct, getProductByName, createProduct, updateProduct } = require("../controllers/product.controller");
const { validateProduct } = require("../utils/validators/product.validator");


users.post("/register", validateUser, createUser)
users.post("/login", loginUser)
users.post("/logout", logoutUser)
users.get("/login/auth", decodeToken)
users.post("/register/newUser", checkToken,verifyToken, hasRole('Admin'), validateUser, createUser)
users.put("/updateUser/:id", checkToken, verifyToken, hasRole('Admin'), updateUser)

users.get("/kitchen/getProducts",checkToken,verifyToken, hasRole('Kitchen'), getProduct)

users.get("/kitchen/getProducts/:name",checkToken, verifyToken, hasRole('Kitchen'),getProductByName)

users.post("/kitchen/createProduct", checkToken, verifyToken, validateProduct, hasRole('Kitchen'),createProduct)

users.put("/kitchen/updateProduct/:id",checkToken, verifyToken, hasRole('Kitchen'), updateProduct)




module.exports = users