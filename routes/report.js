const express = require("express")
const reports = express.Router()
const {checkToken, verifyToken, hasRole} = require("../utils/jwt/checkToken")
const {dailyReport, reportByCashier, productsByCashier} = require("../controllers/report.controller")
const { check } = require("express-validator")

reports.get("/dailyReport/:date", checkToken, verifyToken, hasRole('Admin'), dailyReport)
reports.get("/productsByCashier/:date", checkToken, verifyToken, hasRole('Admin'), productsByCashier)
reports.get("/reportByCashier/:date", checkToken, verifyToken,hasRole('Cashier'), reportByCashier)
module.exports = reports