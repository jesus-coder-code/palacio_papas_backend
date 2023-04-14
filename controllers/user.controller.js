const {PrismaClient} = require("@prisma/client")
const bcrypt = require("bcrypt");
const { generateToken, } = require("../utils/jwt/generateToken");

const prisma = new PrismaClient()

const createUser = async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        await prisma.user.create({data:req.body});
        res.status(200).json({ message: "usuario registrado" });
    } catch (error) {
      res.json({ message: error });
      console.log(error);
    }
  };

const loginUser = async (req, res) =>{
    try {
        const {username} = req.body
        const user = await prisma.user.findUnique({
            where:{
                username,
            }
        })

        if (user){
            const password = bcrypt.compareSync(req.body.password, user.password)

            if (password){
                res.cookie('cookie', generateToken, {
                    maxAge: null,
                    httpOnly: true,
                    secure: true
                })
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

const logoutUser = async (req, res) =>{
    res.clearCookie('cookie')
    res.status(200).json({message:"ha cerrado sesion"})
}

const registerCashier = async (req, res) =>{
    try{
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        const cashier = await prisma.user.create({data:req.body})
        if(cashier){
            res.status(200).json({message:"cajero registrado"})
        }else{
            res.json({message:"no se pudo registar cajero"})
        }
    }catch(error){
        res.status(500).json({message:"ha ocurrido un error al registrar el cajero"})
        console.log(error)
    }
}


module.exports = {
    createUser,
    loginUser,
    logoutUser, 
    registerCashier
}

