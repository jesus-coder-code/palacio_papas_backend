const express = require("express")
const categories = express.Router()
const {validateCategory} = require("../utils/validators/category.validator")
const {checkToken} = require("../utils/jwt/checkToken")
const {createCategory, getCategory} = require("../controllers/category.controller")

categories.get("/getCategories", checkToken, getCategory)
categories.post("/createCategories", checkToken, validateCategory, createCategory)

module.exports = categories