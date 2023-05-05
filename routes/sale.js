const express = require("express")
const sales = express.Router()
const {checkToken, verifyToken, hasRole} = require("../utils/jwt/checkToken")
const {createSale, getSale, earnReport} = require("../controllers/sales.controller")

sales.get("/getSales", checkToken, getSale)
sales.post("/createSale", checkToken, createSale)

module.exports = sales