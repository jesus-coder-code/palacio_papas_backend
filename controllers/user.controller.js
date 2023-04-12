const {PrismaClient} = require("@prisma/client")
const bcrypt = require("bcrypt");
const { generateToken, } = require("../utils/jwt/generateToken");

const prisma = new PrismaClient()

const createUser = async (req, res) => {
    //await prisma.$connect()
    //await prisma.$disconnect()
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        await prisma.user.create({data:req.body});
        res.json({ message: "usuario registrado" });
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





module.exports = {
    createUser,
    loginUser,
    logoutUser, 
    //blacklistToken
}

