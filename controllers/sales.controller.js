const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
const createSale = async (req, res) => {
    try {
        const { products } = req.body
        var total = 0
        const productSales = []
        for (i of products) {
            const { id, quantity } = i
            const productConsult = await prisma.product.findFirst({
                where: {
                    id
                }
            })
            //console.log(productConsult)
            const subtotal = quantity * productConsult.price
            total += subtotal
            productSales.push({
                product: { connect: { id: id } },
                quantity: quantity,
                subtotal: subtotal
            })
        }
        /*const productSales = products.map(product => {
            const { id, quantity } = product
            console.log(productConsult)
            const subtotal = quantity * product.price
            total += subtotal
            return {
                product: { connect: { id: id } },
                quantity: quantity,
                subtotal: subtotal
            }
        })*/

        const sale = await prisma.sale.create({
            data: {
                total: total,
                products: {
                    create: productSales
                }
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (sale) {
            res.json({ message: "venta creada" })
        } else {
            res.json({ message: "no se pudo crear la venta" })
        }

    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const getSale = async (req, res) => {
    try {
        const sale = await prisma.sale.findMany({
            include: {
                products: {
                    select: {
                        product: {
                            select: {
                                name: true,
                                price: true
                            }
                        },
                        quantity: true,
                        subtotal: true
                    }
                }
            },
            orderBy:{
                id: "desc"
            }
        })
        res.status(200).json({ data: sale, message: "success" })
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

module.exports = {
    createSale,
    getSale
}