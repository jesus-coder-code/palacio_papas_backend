const express = require("express")
const categories = express.Router()
const {validateCategory} = require("../middlewares/validators/category.validator")
const {checkToken} = require("../middlewares/jwt/checkToken")
const {createCategory, getCategory} = require("../controllers/category.controller")

categories.get("/getCategories", checkToken, getCategory)
categories.post("/createCategories", checkToken, validateCategory, createCategory)

module.exports = categories