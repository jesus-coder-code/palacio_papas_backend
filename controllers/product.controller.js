const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken")
const multer = require("multer")
const FormData = require("form-data")



/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Carpeta de destino para guardar las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});*/


const getProduct = async (req, res) => {
    try {
        const product = await prisma.product.findMany({
            orderBy: {
                id: "desc"
            }
        })
        if (product) {
            res.status(200).json({ data: product, message: "success" })

        }
        else {
            res.status(404).json({ message: "sin productos" })
        }
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const getProductByName = async (req, res) => {
    try {
        const { name } = req.params
        const productName = await prisma.product.findMany({
            where: {
                name
            }
        })
        if (productName) {
            res.status(200).json({ data: productName, message: "success" })
        }
        else {
            res.status(404).json({ message: "no se ha encontrado este producto" })
        }
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}


const createProduct = async (req, res) => {
    try {
        const { name, price, stock, type, categoryId } = req.body
        const filename = req.files

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                type,
                category: {
                    connect: {
                        id: parseInt(categoryId)
                    }
                },
                image: filename[0]
            }
        })
        if (product) {
            res.status(200).json({ message: "producto creado" })
            const indice = filename[0]
            console.log(indice)
        }
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)

    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, price, stock, type, categoryId } = req.body
        const filename = req.files
        const { id } = req.params
        await prisma.product.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                type,
                category: {
                    connect: {
                        id: parseInt(categoryId)
                    }
                },
                image: filename[0]
            }
        })
        res.status(200).json({ message: "producto actualizado" })
    } catch (error) {
        res.status(500).json({ message: "error al actualizar el producto" })
        console.log(error)
    }
}

const newTravel = async (req, res) => {
    try {
        const { products, userId } = req.body
        const ProductTravel = []
        for (i of products) {
            const { id, quantity } = i
            const productConsult = await prisma.product.findFirst({
                where: { id }
            })
            ProductTravel.push({
                product: { connect: { id: id } },
                quantity: quantity
            })
            const productType = "Withstock"
            if (productConsult.type === productType) {
                if (productConsult.stock < quantity) {
                    return res.status(400).json({ message: "no hay suficiente stock para el producto: " + productConsult.name })
                }
                await prisma.product.updateMany({
                    where: { id },
                    data: {
                        stock: {
                            decrement: quantity
                        }
                    }
                })
            }
        }

        const travel = await prisma.travel.create({
            data: {
                products: {
                    create: ProductTravel
                },
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        if (travel) {
            res.status(200).send({ message: "carga de productos a cajero creada" })
        } else {
            res.status(400).send({ message: "error al cargar productos" })
        }
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const getTravelByDate = async (req, res) => {
    try {
        const date = req.params.date
        const newdate = new Date(date)
        const productsByCashier = await prisma.$queryRaw`SELECT u.username AS cashierName, p.name AS productName, SUM(pt.quantity) AS quantityTravel FROM Product p INNER JOIN ProductTravel pt ON p.id = pt.productId INNER JOIN Travel t ON pt.travelId = t.id INNER JOIN User u ON u.id = t.userId WHERE DATE(t.date) = ${newdate} GROUP BY u.id, p.id`

        /*const groupResult = {}
        productsByCashier.forEach((row) => {
            const { cashierName, productName, quantityTravel } = row
            if (!groupResult[cashierName]) {
                groupResult[cashierName] = []
            }
            groupResult[cashierName].push({ product: productName, quantity: quantityTravel })
        })*/
        const groupResult = [];

        productsByCashier.forEach((row) => {
            const { cashierName, productName, quantityTravel } = row;

            // Buscar si el cajero ya existe en groupResult
            const existingCashier = groupResult.find(item => item.cashier === cashierName);

            if (existingCashier) {
                // Si el cajero ya existe, agregar el producto y cantidad al cajero existente
                existingCashier.products.push({ product: productName, quantity: quantityTravel });
            } else {
                // Si el cajero no existe, agregar un nuevo objeto de cajero al arreglo
                groupResult.push({
                    cashier: cashierName,
                    products: [{ product: productName, quantity: quantityTravel }]
                });
            }
        });
        res.status(200).json({ message: "success", data: groupResult, status: "ok" })

    } catch (error) {
        res.status(500).send({ message: "error interno" })
        console.log(error)
    }
}

const deleteTravel = async (req, res) => {
    try {
        const token = req.headers['verification']
        const date = req.params.date
        const newdate = new Date(date)
        let auth = {}
        const { id } = req.params

        if (!token) {
            return res.status(401).json({ message: "no se proporcionó un token" })
        }
        auth = jwt.decode(token, "secretKey")
        req.userId = auth.userId
        const userId = req.userId
        const drop = await prisma.travel.delete({
            where: {
                id: parseInt(id),
            }
        })
        if (drop) {
            res.status(200).send({ message: "carga eliminada" })
        } else {
            res.status(400).send({ message: "error al eliminar la carga" })
        }
    } catch (error) {
        res.status(500).send({ message: "error interno" })
        console.log(error)
    }
}

const getTravel = async (req, res) => {
    const travel = await prisma.travel.findMany({
        include: {
            user: {
                select: {
                    username: true
                }
            },
            products: {
                select: {
                    product: {
                        select: {
                            name: true
                        }
                    },
                    quantity: true
                }
            }
        },
        orderBy: { id: "desc" }
    })
    res.status(200).json({ data: travel, message: "success" })
}

module.exports = {
    getProduct,
    getProductByName,
    createProduct,
    updateProduct,
    newTravel,
    getTravel,
    deleteTravel,
    getTravelByDate
}