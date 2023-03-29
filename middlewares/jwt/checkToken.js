const moment = require("moment");
const jwt = require("jsonwebtoken")



const checkToken = (req, res, next) => {
  if (!req.headers["user-token"]) {
    return res.json({ message: "es necesario un token" });
  }

  const userToken = req.headers["user-token"];
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
  if(!req.headers["verification"]) {
    return res.json({message:"necesitas un token"})
  }

  const verification = req.headers["verification"]
  let authData = {}
  try{
    authData = jwt.decode(verification, "secret key")
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
