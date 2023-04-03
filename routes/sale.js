const express = require("express")
const sales = express.Router()
const {validateSale} = require("../middlewares/validators/sale.validator")
const {checkToken} = require("../middlewares/jwt/checkToken")
const {createSale, getSale} = require("../controllers/sales.controller")

sales.get("/getSales", checkToken, getSale)

sales.post("/createSale", checkToken, validateSale, createSale)

module.exports = sales