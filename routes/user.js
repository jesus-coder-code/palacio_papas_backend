const express = require("express");
const users = express.Router();
const {createUser, loginUser, Auth} = require("../controllers/user.controller");
//const { checkToken } = require("../middlewares/jwt/checkToken");
const {validateUser} = require("../middlewares/validators/user.validator")

const jwt = require("jsonwebtoken")

users.post("/register", validateUser, createUser)
users.post("/login", loginUser)
/*users.get("/login/auth", verifyToken, (req, res)=>{
    jwt.verify(req.token, 'secretkey', (error, authData)=>{
        if(error){
            res.sendStatus(403)
        }
        else{
            res.json({authData})
        }
    })
})


function verifyToken(req,res,next){
    const bearerHeader = req.headers['Autorization']

    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1]
        req.token = bearerToken
        next()
    }
    else{
        res.sendStatus(403)
    }
}*/


module.exports = users