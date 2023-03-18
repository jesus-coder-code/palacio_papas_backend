const express = require("express");
const users = express.Router();
const {createUser, loginUser} = require("../controllers/user.controller")
const {validateUser} = require("../middlewares/validators/user.validator")

users.post("/register", validateUser, createUser)
users.post("/login", loginUser)

module.exports = users