const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt");
const { generateToken, } = require("../utils/jwt/generateToken");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient()

const createUser = async (req, res) => {
    try {
        const { username, role } = req.body
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
            const password = bcrypt.hashSync(req.body.password, 10);

            await prisma.user.create({
                data: {
                    username,
                    password,
                    role
                },
            })
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
            where: {
                OR: [
                    { username: username }
                ]
            }
        })
        if (found) {
            res.status(409).json({ message: "este usuario ya existe, elija otro" })
        } else {
            await prisma.user.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    username,
                    password
                }
            })
            res.status(200).json({ message: "usuario actualizado" })
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

const newCashier = async (req, res) => {
    try {
        const { username, role } = req.body
        const found = await prisma.user.findFirst({
            where: {
                OR: [{ username: username }]
            }
        })
        if (found) {
            res.status(409).json({ message: "este usuario ya existe" })
        } else {
            const password = bcrypt.hashSync(req.body.password, 10)
            const cashierCategories = []
            const { categories } = req.body
            for (i of categories) {
                const { id } = i
                const categoryConsult = await prisma.category.findFirst({
                    where: {
                        id
                    }
                })
                cashierCategories.push({
                    category: { connect: { id: categoryConsult.id } }
                })
            }

            const cashier = await prisma.user.create({
                data: {
                    username: username,
                    password: password,
                    categories: {
                        create: cashierCategories
                    },
                    role: role
                },
                include: {
                    categories: {
                        include: {
                            category: true
                        }
                    }
                }
            })
            if (cashier) {
                res.status(200).json({ message: "cajero registrado" })
            } else {
                res.status(400).json({ message: "no se pudo registrar el cajero" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const updateCashier = async (req, res) => {
    try {
        const { username, role } = req.body
        const { id } = req.params

        const password = bcrypt.hashSync(req.body.password, 10)
        const cashierCategories = []
        const { categories } = req.body
        for (i of categories) {
            const { id } = i
            const categoryConsult = await prisma.category.findFirst({
                where: {
                    id
                }
            })
            cashierCategories.push({
                category: { connect: { id: categoryConsult.id } }
            })
        }

        const cashier = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                username: username,
                password: password,
                categories: {
                    update: cashierCategories
                },
                role: role
            },
            /*include: {
                categories: {
                    include: {
                        category: true,
                    }
                }
            }*/
        })

        if (cashier) {
            res.status(200).json({ message: "cajero actualizado" })
        } else {
            res.status(400).json({ message: "no se pudo actualizar el cajero" })
        }

    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}



const getAllCashier = async (req, res) => {
    try {
        const all = await prisma.user.findMany({
            include: {
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                products: {
                                    select: {
                                        name: true,
                                        price: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json({ message: "success", data: all, status: "ok" })
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const getKitchen = async (req, res) => {
    try {
        const all = await prisma.user.findMany({
            where: {
                role: 'Kitchen'
            }
        })
        res.status(200).json({ message: "success", data: all, status: "ok" })
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}


const getCashier = async (req, res, next) => {
    const token = req.headers['verification']
    let auth = {}
    try {

        if (!token) {
            return res.status(401).json({ message: "no se proporcionó un token" })
        }
        auth = jwt.decode(token, "secretKey")
        req.userId = auth.userId
        req.role = auth.role
        const role = req.role
        const userId = req.userId
        console.log(userId)
        if (role === "Kitchen") {
            res.status(200).send({ message: "esta es la cocina" })
        } else {
            const datos = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    username: true,
                    categories: {
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    products: {
                                        select: {
                                            id: true,
                                            name: true,
                                            price: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            const datas = [datos]
            res.status(200).json({ message: "success", data: datas, status: "ok" })
        }
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}






module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    newCashier,
    getCashier,
    getAllCashier,
    getKitchen,
    updateCashier,
}

