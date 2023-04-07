const {User} = require("../database/database")
const bcrypt = require("bcrypt");
const { generateToken, } = require("../middlewares/jwt/generateToken");
const cookie = require("cookie")
//const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const {Blacklist} = require("../database/database")

//const checkToken = require("../middlewares/jwt/checkToken");
//const jwt = require("jwt-simple")

const createUser = async (req, res) => {
    try {
        /*const user = User.findOne({where:{user: req.body.user}})
        const email = User.findOne({where:{email: req.body.email}})
        if(email){
            res.json({message: "este email ya esta en uso"})
        } 
        if (user){
            res.json({message: "este usuario ya existe"})
        }else{
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            await User.create(req.body)
            res.json({message: "usario creado"})
        }*/
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        await User.create(req.body);
        res.json({ message: "usuario registrado" });
    } catch (error) {
      res.json({ message: error });
      console.log(error);
    }
  };

const loginUser = async (req, res) =>{
    try {
        const user = await User.findOne({where: {user: req.body.user}})

        if (user){
            const password = bcrypt.compareSync(req.body.password, user.password)

            if (password){
                res.json({token: generateToken(user, password)})
                console.log("usuario logeado")
            } else{
                res.json({message:"contraseña incorrecta"})
            }
        } else{
            res.json({message:"usuario y/o contraseña incorrectos"})
        }

    } catch (error) {
        res.json({message:"ha ocurrido un error"})
        console.log(error)
    }
}

const logoutUser = async (req, res, next) =>{
    try{
        const tokenblock = req.headers["verification"]
        await Blacklist.create({token: tokenblock})
        res.json({message: "ha cerrado sesion correctamente"})

    }catch(error){
        console.log(error)
        res.json({error})
    }
    next()
}

const blacklistToken = async (req, res, next) =>{
    try{
      const {token} = req.headers
      const searchToken = await Blacklist.findOne({where:{token}})
      if(searchToken){
        res.status(401).json({message:"vuelva a iniciar sesion"})
      }
      else{
        next()
      }
    }catch(error){
        res.json({error})
    }
  }




module.exports = {
    createUser,
    loginUser,
    logoutUser, 
    blacklistToken
}

