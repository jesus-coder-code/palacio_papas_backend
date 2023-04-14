const express = require("express")
const sales = express.Router()
const {checkToken} = require("../utils/jwt/checkToken")
const {createSale, getSale} = require("../controllers/sales.controller")

sales.get("/getSales", checkToken, getSale)
sales.post("/createSale", checkToken, createSale)

module.exports = sales