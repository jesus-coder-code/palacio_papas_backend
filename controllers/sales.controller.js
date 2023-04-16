const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
const createSale = async (req, res) => {
    try {
        const { date, products } = req.body
        const sale = await prisma.sale.create({
            data: {
                date,
                total: 0,
                products: {
                    create: products.map(product => ({
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity,
                        category: { connect: { id: categoryId } }
                    }))
                }
            },
            include: { products: true }
        })

        sale.total = sale.products.reduce((acc, product) => acc + product.price, 0)
        await prisma.sale.update({
            where: {
                id: sale.id
            },
            data: {
                total: sale.total
            }
        })
        if(sale){
            res.status(200).json({message:"venta creada satisfactoriamente"})
        }else{
            res.status(400).json({message:"no se pudo realizar la venta"})
        }
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const getSale = async (req, res) => {
    try {
        res.status(200).json({ message: "aqui se muestran las ventas" })
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

module.exports = {
    createSale,
    getSale
}