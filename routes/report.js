const express = require("express")
const reports = express.Router()
const {checkToken, verifyToken, hasRole} = require("../utils/jwt/checkToken")
const {dailyReport, reportByCashier} = require("../controllers/report.controller")

reports.get("/dailyReport/:date", checkToken, verifyToken, hasRole('Admin'), dailyReport)
reports.get("/reportByCashier/:date", checkToken, verifyToken, hasRole('Admin'), reportByCashier)

module.exports = reports