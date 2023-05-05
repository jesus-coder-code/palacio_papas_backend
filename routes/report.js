const express = require("express")
const reports = express.Router()
const {checkToken, verifyToken, hasRole} = require("../utils/jwt/checkToken")
const {dailyReport} = require("../controllers/report.controller")

reports.get("/dailyReport/:date", checkToken, verifyToken, hasRole('Admin'), dailyReport)

module.exports = reports