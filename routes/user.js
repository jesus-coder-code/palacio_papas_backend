const express = require("express");
const users = express.Router();
const {createUser, loginUser, Auth} = require("../controllers/user.controller");
const { decodeToken } = require("../middlewares/jwt/checkToken");
const {validateUser} = require("../middlewares/validators/user.validator")

const jwt = require("jsonwebtoken")

users.post("/register", validateUser, createUser)
users.post("/login", loginUser)
users.get("/login/auth", decodeToken)



module.exports = users