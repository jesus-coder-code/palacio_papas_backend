const express = require("express")
const expense = express.Router()
const {newExpense, getExpense } = require("../controllers/expense.controller")
const {hasRole, checkToken, verifyToken} = require("../utils/jwt/checkToken")

expense.post("/newExpense", checkToken, verifyToken, hasRole('Cashier'), newExpense)
expense.get("/getExpense", checkToken, verifyToken, hasRole('Admin'), getExpense)

module.exports = expense