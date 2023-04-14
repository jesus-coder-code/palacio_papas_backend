const express = require("express")
const categories = express.Router()
const {validateCategory} = require("../utils/validators/category.validator")
const {checkToken, hasRole, verifyToken} = require("../utils/jwt/checkToken")
const {createCategory, getCategory, updateCategory} = require("../controllers/category.controller")

categories.get("/getCategories", checkToken, verifyToken,hasRole('Admin'), getCategory)
categories.post("/createCategories", checkToken, verifyToken, hasRole('Admin'),validateCategory, createCategory)
categories.put("/updateCategories/:id", checkToken,verifyToken,hasRole('Admin'), updateCategory)
module.exports = categories