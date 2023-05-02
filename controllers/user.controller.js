const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt");
const { generateToken, } = require("../utils/jwt/generateToken");

const prisma = new PrismaClient()

const createUser = async (req, res) => {
    try {
        const { username } = req.body
        const found = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username }
                ]
            }
        })
        if (found) {
            res.status(409).json({ message: "este usuario ya existe, elija otro" })
        } else {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            await prisma.user.create({ data: req.body })
            res.status(200).json({ message: "usuario registrado" })
        }
    } catch (error) {
        res.json({ message: error });
        console.log(error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username } = req.body
        const user = await prisma.user.findUnique({
            where: {
                username,
            }
        })

        if (user) {
            const password = bcrypt.compareSync(req.body.password, user.password)

            if (password) {
                res.cookie('cookie', generateToken, {
                    maxAge: null,
                    httpOnly: true,
                    secure: true
                })
                res.json({ token: generateToken(user, password) })
                console.log("usuario logeado")
            } else {
                res.status(400).json({ message: "contraseña incorrecta" })
            }
        } else {
            res.status(400).json({ message: "usuario y/o contraseña incorrectos" })
        }

    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie('cookie')
    res.status(200).json({ message: "ha cerrado sesion" })
}

const updateUser = async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const { username, password } = req.body
        const { id } = req.params
        const found = prisma.user.findFirst({
            where:{
                OR:[
                    {username: username}
                ]
            }
        })
        if(found){
            res.status(409).json({message:"este usuario ya existe, elija otro"})
        }else{
            await prisma.user.update({
                where:{
                    id: parseInt(id)
                },
                data:{
                    username, 
                    password
                }
            })
            res.status(200).json({message:"usuario actualizado"})
        }
        /*await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                username,
                password
            }
        })
        res.status(200).json({ message: "usuario actualizado" })*/
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser
}

