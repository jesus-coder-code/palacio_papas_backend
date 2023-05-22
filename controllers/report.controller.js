const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const dailyReport = async (req, res) => {
    try {
        const date = req.params.date

        const courtesies = await prisma.courtesy.findMany({
            where: {
                date: new Date(date)
            }
        })
        //res.status(200).send(report)

        const expenses = await prisma.expense.findMany({
            where: {
                date: new Date(date)
            }
        })

        const payments = await prisma.payment.findMany({
            where: {
                date: new Date(date)
            }
        })

        const sales = await prisma.sale.findMany({
            where: {
                date: new Date(date)
            },
            include: {
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
            }
        })

        const cashes = await prisma.sale.findMany({
            where: {
                date: new Date(date),
                method: {
                    equals: 'Cash'
                }
            }
        })

        const transfers = await prisma.sale.findMany({
            where: {
                date: new Date(date),
                method: {
                    equals: 'Transfer'
                }
            }
        })

        /*const productSales = await prisma.sale.findMany({
            where:{
                date: new Date(date)
            },
            select:{
                products:{
                    select:{
                        product:{
                            select:{
                                name:true
                            }
                        },
                        quantity:true
                    }
                }
            },
        })
        const quantitySale = {}
        for (i of productSales){
            const {product, quantity} = i
            if(quantitySale[product]){
                quantitySale[product] += quantity
            }else{
                quantitySale[product] = quantity
            }
        }*/
        //console.log(quantitySale)
        //console.log(sales)
        const dailySale = sales.reduce((total, sale) => total + sale.total, 0)
        const onCash = cashes.reduce((total, sale) => total + sale.total, 0)
        const onTransfer = transfers.reduce((total, sale) => total + sale.total, 0)
        const dailyCourtesy = courtesies.reduce((total, courtesy) => total + courtesy.total, 0)
        const dailyExpense = expenses.reduce((total, expense) => total + expense.total, 0)
        const dailyPayment = payments.reduce((total, payment) => total + payment.total, 0)
        

        const discount = {
            dailyExpense: dailyExpense,
            dailyPayment: dailyPayment,
            dailyCourtesy: dailyCourtesy
        }
        let totalDiscount = 0
        for (let i in discount) {
            totalDiscount += discount[i]
        }
        const dailyReport = [{
            dailySale: dailySale,
            onCash: onCash,
            onTransfer: onTransfer,
            dailyExpense: dailyExpense,
            dailyPayment: dailyPayment,
            dailyCourtesy: dailyCourtesy,
            totalDiscount: totalDiscount,
        }]

        res.status(200).json({message:"success", data: dailyReport, status:"ok"})
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)

    }
}

module.exports = {
    dailyReport
}