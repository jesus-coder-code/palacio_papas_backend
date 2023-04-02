const express = require("express");
const users = express.Router();
const {createUser, loginUser, logoutUser} = require("../controllers/user.controller");
const { decodeToken } = require("../middlewares/jwt/checkToken");
const {validateUser} = require("../middlewares/validators/user.validator")

const jwt = require("jsonwebtoken")

users.post("/register", validateUser, createUser)
users.post("/login", loginUser)
//users.post("/logout", logoutUser)
users.get("/login/auth", decodeToken)



module.exports = users