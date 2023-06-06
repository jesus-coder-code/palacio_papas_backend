const express = require("express")
const sales = express.Router()
const {checkToken, verifyToken, hasRole} = require("../utils/jwt/checkToken")
const {createSale, getSale, earnReport, getHistorySale, deleteSale} = require("../controllers/sales.controller")

sales.get("/getSales", checkToken, verifyToken, getSale)
sales.post("/createSale", checkToken, verifyToken, createSale)
//sales.get("/getHistorySale", checkToken, verifyToken, hasRole('Cashier'), getHistorySale)
sales.delete("/deleteSale/:id", checkToken, verifyToken, hasRole('Cashier'), deleteSale)

module.exports = sales