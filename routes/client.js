const express = require("express")
const clients = express.Router()
const {createClient, getClients} = require("../controllers/client.controller")
const {hasRole, checkToken, verifyToken} = require("../utils/jwt/checkToken")
const {validateClient} = require("../utils/validators/client.validator")

clients.post("/register", checkToken, verifyToken, hasRole('Admin'), validateClient, createClient)
clients.get("/getClients", checkToken, verifyToken, hasRole('Admin'), getClients)


module.exports = clients