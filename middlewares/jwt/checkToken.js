const moment = require("moment");
const jwt = require("jsonwebtoken")



const checkToken = (req, res, next) => {
  if (!req.headers["Authorization"]) {
    return res.status(400);
  }
  /*try{
    const head = req.headers["Authorization"]
    if(!head){
      res.status(400).json()
    }
  }catch(error){
    res.json({message:error})
  }*/
  

  const userToken = req.headers["Authorization"];
  let payload = {};
  try {
    payload = jwt.decode(userToken, "secret Key");
    //res.json({payload})
  } catch (error) {
    console.log(error);
    return res.json({ message: "token incorrecto" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.json({ message: "token expirado" });
  }

  req.userId = payload.userId;

  next();
};

const decodeToken = (req, res, next) =>{
  /*if(!req.headers["Authorization"]) {
    return res.status(400)
  }*/
  try{
    const head = req.headers["Authorization"]
    if(!head){
      return res.status(400).json()
    }
  }catch(error){
    res.json({message:error})
  }

  const verification = req.headers["Authorization"]
  let authData = {}
  try{
    authData = jwt.decode(verification, "secret key")
    //retornar datos de usuario
    res.json({authData})
  }catch(error){
    console.log(error)
    return res.json({message:"token incorrecto"})
  }

  if(authData.expiredAt < moment().unix()){
    return res.json({message:"token ha expirado"})
  }

  req.userId = authData.userId
  req.email = authData.email
  req.user = authData.user
  req.password = authData.password

  next()
}

module.exports = {
  checkToken: checkToken,
  decodeToken: decodeToken
};
