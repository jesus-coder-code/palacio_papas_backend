const moment = require("moment");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()


const checkToken = (req, res, next) => {
  if (!req.headers["verification"]) {
    res.json({message:"debes logearte"})
    return res.status(401);
  }

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
    //res.json({message:"necesitas un token"})
    return res.status(401).json({message:"necesitas un token"})
  }

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
  req.username = authData.username
  req.password = authData.password
  req.role = authData.role

  next()
}


function verifyToken(req, res, next) {
  // Obtener el token de la cabecera de la solicitud
  const token = req.headers['verification'];
  try{
    if (!token) {
      return res.status(401).send({ message: 'No se proporcionó un token de autenticación.' });
    }
  
    // Verificar el token
    jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'El token de autenticación es inválido.' });
      }
      // Agregar el id del usuario al objeto de solicitud
      req.userId = decoded.id;
      req.userRole = decoded.role;
  
      next();
    });
  }catch(error){
    res.status(500).json({message:"error interno"})
    console.log(error)
  }
}
function hasRole(role) {
  return (req, res, next) => {
    if (req.userRole !== role) {
      res.status(403).json({ message: 'No tienes acceso aqui' });
    }else{
      next()
    }
  }
}

/*function verifyId(req, res, next) {
  // Obtener el token de la cabecera de la solicitud
  const token = req.headers['verification'];
  try{
    if (!token) {
      return res.status(401).send({ message: 'No se proporcionó un token de autenticación.' });
    }
  
    // Verificar el token
    jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'El token de autenticación es inválido.' });
      }
      // Agregar el id del usuario al objeto de solicitud
      req.userId = decoded.id;
    });
  }catch(error){
    res.status(500).json({message:error})
    console.log(error)
  }
}*/

/*function hasId(id){
  return (req, res, next) => {
    if(req.userId == id){
      res.status(403).json({ message: 'eres cajero pero no tienes acceso aqui' });
    }else{
      next()
    }
  }
}*/



module.exports = {
  checkToken: checkToken,
  decodeToken: decodeToken,
  hasRole: hasRole,
  //hasId: hasId,
  verifyToken: verifyToken,
};
