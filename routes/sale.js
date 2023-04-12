const express = require("express")
const sales = express.Router()
const {validateSale} = require("../utils/validators/sale.validator")
const {checkToken} = require("../utils/jwt/checkToken")
const {createSale, getSale} = require("../controllers/sales.controller")

sales.get("/getSales", checkToken, getSale)

sales.post("/createSale", checkToken, validateSale, createSale)

module.exports = sales