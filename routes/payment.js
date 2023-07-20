const express = require("express")
const payments = express.Router()
const {getPayments, newPayment, deletePayment} = require("../controllers/payment.controller")
const {hasRole, checkToken, verifyToken} = require("../utils/jwt/checkToken")

payments.post("/newPayment", checkToken, verifyToken, hasRole('Admin'), newPayment)
payments.get("/getPayments", checkToken, verifyToken, hasRole('Admin'), getPayments)
payments.delete("/deletePayment",checkToken, verifyToken, hasRole('Admin'), deletePayment)

module.exports = payments