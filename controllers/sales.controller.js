const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
const createSale = async (req, res, next) => {
    try {
        const { products, method } = req.body
        var total = 0
        await prisma.$transaction(async (prisma) => {
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

            const sale = await prisma.sale.create({
                data: {
                    total: total,
                    products: {
                        create: productSales
                    },
                    method: method
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
                res.status(200).json({ message: "venta creada" })
            } else {
                res.json({ message: "no se pudo crear la venta" })
            }
        })



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
            orderBy: {
                id: "desc"
            }
        })
        //res.status(200).json({ data: sale, message: "success" })
        res.status(200).send(sale)
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}



module.exports = {
    createSale,
    getSale
}