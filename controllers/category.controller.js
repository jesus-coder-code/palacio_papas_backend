const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const createCategory = async (req, res) => {
    try {
        const { name } = req.body
        const found = await prisma.category.findFirst({
            where: {
                OR: [
                    { name: name }
                ]
            }
        })
        if (found) {
            res.status(409).json({ message: "esta categoria ya existe" })
        } else {
            await prisma.category.create({ data: req.body })
            res.status(200).json({ message: "categoria creada" })
        }
    } catch (error) {
        res.json({ message: error })
    }
}

const getCategory = async (req, res) => {
    const token = req.headers['verification']
    let auth = {}
    try {
        if (!token) {
            return res.status(401).json({ message: "no se proporciono un token" })
        }
        auth = jwt.decode(token, "secretkey")
        req.userId = auth.userId
        req.role = auth.role
        const role = req.role
        const userId = req.userId
        if (role !== "Kitchen") {
            res.status(200).json({ message: "esta es la cocina" })
        } else {
            const category = await prisma.category.findMany({
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            stock: true,
                            type: true,
                            categoryId: true,
                            image: true
                        }
                    }
                }
            })
            if (category) {
                res.status(200).json({ data: category, message: "success" })
            }
            else {
                res.status(404).json({ message: "no hay categorias" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        const { id } = req.params
        await prisma.category.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                description
            }
        })
        res.status(200).json({ message: "categoria actualizada" })
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}

module.exports = {
    createCategory,
    getCategory,
    updateCategory
}