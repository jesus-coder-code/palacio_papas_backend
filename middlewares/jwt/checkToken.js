const moment = require("moment");
const jwt = require("jsonwebtoken")



const checkToken = (req, res, next) => {
  if (!req.headers["verification"]) {
    res.json({message:"debes logearte"})
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
  

  const userToken = req.headers["verification"];
  let payload = {};
  try {
    payload = jwt.decode(userToken, "secretKey");
    //res.json({payload})
  } catch (error) {
    console.log(error);
    return res.json({ message: "token incorrecto" });
  }

  if (payload.expiredAt < moment().unix()) {
    return res.json({ message: "la sesion ha expirado" });
  }

  req.userId = payload.userId;

  next();
};

const decodeToken = (req, res, next) =>{
  if(!req.headers["verification"]) {
    res.json({message:"necesitas un token"})
    return res.status(400).json()
  }
  /*try{
    const head = req.headers["authorization"]
    console.log(head)
    if(!head){
      return res.status(400).json()
    }
  }catch(error){
    res.status(400)
    res.json({message:error})
  }*/

  const verification = req.headers["verification"]
  let authData = {}
  try{
    authData = jwt.decode(verification, "secretKey")
    //retornar datos de usuario
    res.json({authData})
  }catch(error){
    console.log(error)
    return res.json({message:"token incorrecto"})
  }

  if(authData.expiredAt < moment().unix()){
    return res.json({message:"la sesion ha expirado"})
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
