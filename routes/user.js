const express = require("express");
const users = express.Router();
const {createUser, loginUser, logoutUser} = require("../controllers/user.controller");
const { decodeToken } = require("../utils/jwt/checkToken");
const {validateUser} = require("../utils/validators/user.validator")


users.post("/register", validateUser, createUser)
users.post("/login", loginUser)
users.post("/logout", logoutUser)
users.get("/login/auth", decodeToken)



module.exports = users