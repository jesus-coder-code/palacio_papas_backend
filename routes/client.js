const express = require("express")
const clients = express.Router()
const {createClient, getClients, createCourtesy, getCourtesy} = require("../controllers/client.controller")
const {hasRole, checkToken, verifyToken} = require("../utils/jwt/checkToken")
const {validateClient} = require("../utils/validators/client.validator")

clients.post("/register", checkToken, verifyToken, hasRole('Admin'), validateClient, createClient)
clients.get("/getClients", checkToken, verifyToken, hasRole('Admin'), getClients)
clients.post("/createCourtesy", checkToken, verifyToken, hasRole('Admin'),createCourtesy)
clients.get("/getCourtesy", checkToken, verifyToken, hasRole('Admin'), getCourtesy)

module.exports = clients