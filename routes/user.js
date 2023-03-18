const express = require("express");
const users = express.Router();
const {createUser} = require("../controllers/user.controller")

users.post("/register", createUser)

module.exports = users