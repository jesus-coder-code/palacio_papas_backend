const express = require("express");
const users = express.Router();
const { createUser, loginUser, logoutUser, updateUser, newCashier, getCashier, getAllCashier, getKitchen, updateCashier, getHistoryCashier } = require("../controllers/user.controller");
const { decodeToken, hasRole, checkToken, verifyToken, hasId } = require("../utils/jwt/checkToken");
const { validateUser } = require("../utils/validators/user.validator");
const { getProduct, getProductByName, createProduct, updateProduct } = require("../controllers/product.controller");
const { validateProduct } = require("../utils/validators/product.validator");

users.post("/register", validateUser, createUser)
users.post("/login", loginUser)
//users.post("/loginCashier", loginCashier)
users.post("/logout", logoutUser)
users.get("/login/auth", decodeToken)
users.post("/register/newKitchen", checkToken, verifyToken, hasRole('Admin'), validateUser, createUser)
users.get("/kitchen/getKitchen", checkToken, verifyToken, hasRole('Admin'), getKitchen)
users.put("/updateUser/:id", checkToken, verifyToken, hasRole('Admin'), updateUser)

users.get("/kitchen/getProducts", checkToken, verifyToken, hasRole('Kitchen'), getProduct)

users.get("/cashier/getAllCashier", checkToken, verifyToken, hasRole('Admin'), getAllCashier)

users.get("/kitchen/getProducts/:name", checkToken, verifyToken, hasRole('Kitchen'), getProductByName)
users.get("/cashier", checkToken, verifyToken, hasRole('Cashier'), getCashier)
users.post("/kitchen/createProduct", checkToken, verifyToken, validateProduct, hasRole('Kitchen'), createProduct)

users.put("/kitchen/updateProduct/:id", checkToken, verifyToken, hasRole('Kitchen'), updateProduct)
users.post("/register/newCashier", checkToken, verifyToken, hasRole('Admin'), validateUser, newCashier)
users.put("/cashier/updateCashier/:id", checkToken, verifyToken, hasRole('Admin'), validateUser, updateCashier)
users.get("/cashier/getHistoryCashier/:date", checkToken, verifyToken,hasRole('Cashier'), getHistoryCashier)



module.exports = users