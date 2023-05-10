const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const dailyReport = async (req, res) => {
    try {
        const date = req.params.date
        
        const courtesies = await prisma.courtesy.findMany({
            where:{
                date: new Date(date)
            }
        })
        //res.status(200).send(report)

        const expenses = await prisma.expense.findMany({
            where:{
                date: new Date(date)
            }
        })

        const payments = await prisma.payment.findMany({
            where:{
                date: new Date(date)
            }
        })
        
        const sales = await prisma.sale.findMany({
            where:{
                date: new Date(date)
            },
            include:{
                products: {
                    select:{
                        product: {
                            select:{
                                name: true
                            }
                        },
                        quantity: true
                    }
                }
            }
        })
        //console.log(sales)
        const dailySale = sales.reduce((total, sale) => total + sale.total, 0)
        const dailyCourtesy = courtesies.reduce((total, courtesy) => total + courtesy.total, 0)
        const dailyExpense = expenses.reduce((total, expense) => total + expense.total, 0)
        const dailyPayment = payments.reduce((total, payment) => total + payment.total, 0)


        const productSales = {}
        sales.forEach(sale =>{
            if(productSales[sale.products]){
                productSales[sale.products] = 0
            }else{
                productSales[sale.products] += sale.quantity
            }
        })
        const dailyReport = [{dailySale:dailySale, dailyExpense: dailyExpense, dailyPayment: dailyPayment}]
        res.status(200).send(dailyReport)
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)

    }
}

module.exports = {
    dailyReport
}