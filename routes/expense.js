const express = require("express")
const expense = express.Router()
const {newExpense, getExpense, getExpenseByUser, deleteExpense } = require("../controllers/expense.controller")
const {hasRole, checkToken, verifyToken} = require("../utils/jwt/checkToken")

expense.post("/newExpense", checkToken, verifyToken, newExpense)
expense.get("/getExpense", checkToken, verifyToken, hasRole('Admin'), getExpense)
expense.get("/getExpenseByUser", checkToken, verifyToken, getExpenseByUser)
expense.delete("/deleteExpense", checkToken, verifyToken, hasRole('Admin'), deleteExpense)

module.exports = expense