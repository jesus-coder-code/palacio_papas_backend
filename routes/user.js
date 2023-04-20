const express = require("express");
const users = express.Router();
const {createUser, loginUser, logoutUser, registerCashier, updateUser} = require("../controllers/user.controller");
const { decodeToken, hasRole, checkToken, verifyToken } = require("../utils/jwt/checkToken");
const {validateUser} = require("../utils/validators/user.validator");


users.post("/register", validateUser, createUser)
users.post("/login", loginUser)
users.post("/logout", logoutUser)
users.get("/login/auth", decodeToken)
users.post("/register/cashier", verifyToken, hasRole('Admin'), validateUser, createUser)
users.put("/updateUser/:id", checkToken, verifyToken, hasRole('Admin'), updateUser)




module.exports = users