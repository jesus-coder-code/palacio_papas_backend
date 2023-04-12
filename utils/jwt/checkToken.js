const moment = require("moment");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()


const checkToken = (req, res, next) => {
  if (!req.headers["verification"]) {
    res.json({message:"debes logearte"})
    return res.status(400);
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
    res.json({message:"necesitas un token"})
    return res.status(400).json()
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
  req.user = authData.user
  req.password = authData.password
  req.role = authData.role

  next()
}

/*const requireRole = async (role, req, res, next) =>{
  const roleVerification = req.headers["verification"]
  try{
    const decoded = jwt.decode(roleVerification, "secretKey")
    const usuario = await prisma.user.findUnique({
      where:{
        id: decoded.id
      }
    })
    if(usuario.role === role){
      next()
    }else{
      res.status(401).json({message:"No esta autorizado"})
    }
  }catch(error){
    console.log(error)
    res.json({error})

  }
}*/

function requireRole(role) {
  return async (req, res, next) => {
    //const token = req.headers.authorization;
    /*const token = req.headers["verification"]
    if (!token) {
      return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
    }*/

    try {
      const authHeader = req.headers['verification'];
      const token = authHeader && authHeader.split(' ')[1];
      const decoded = jwt.decode(token, "secretKey");
      //const userId = decoded.id
      const usuario = await prisma.user.findUnique({
        where: { id: 1 },
      });
      if (usuario.role === role) {
        next();
      } else {
        res.status(401).json({message:"no esta autorizado"});
      }
    } catch (error) {
      res.status(400).json({ mensaje: "error" });
      console.log(error)
    }
  };
}




module.exports = {
  checkToken: checkToken,
  decodeToken: decodeToken,
  requireRole: requireRole
};
