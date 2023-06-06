const { PrismaClient } = require("@prisma/client")
const jwt = require("jsonwebtoken")


const prisma = new PrismaClient()

const dailyReport = async (req, res) => {
    try {
        const token = req.headers['verification']
        const date = req.params.date
        const newdate = new Date(date)
        let auth = {}
        if (!token) {
            return res.status(401).json({ message: "no se proporcionó un token" })
        }
        auth = jwt.decode(token, "secretKey")
        req.userId = auth.userId
        req.userRole = auth.role
        const userId = req.userId
        const userRole = req.userRole
        if (userRole === 'Admin') {
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
                    },
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

            const newdate = new Date(date)
            const quantityByProduct = await prisma.$queryRaw`SELECT p.name AS productName, SUM(ps.quantity) AS quantitySale FROM Product p INNER JOIN ProductSale ps ON p.id = ps.productId INNER JOIN Sale s ON ps.saleId = s.id WHERE DATE(s.date) = ${newdate} GROUP BY p.name`
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
            //const dailySale = onCash + onTransfer
            let totalDiscount = 0
            for (let i in discount) {
                totalDiscount += discount[i]
            }
            const dailyReport = [{
                totalDailySale: dailySale,
                totalOnCash: onCash,
                totalOnTransfer: onTransfer,
                totalDailyExpense: dailyExpense,
                dailyPayment: dailyPayment,
                dailyCourtesy: dailyCourtesy,
                totalDiscount: totalDiscount,
                quantityByProduct: quantityByProduct
            }]

            return res.status(200).send([{ message: "success", data: dailyReport, status: "ok" }])
            //console.log(dailyReport)
        } else if (userRole === 'Cashier') {
            //reporte diario por cajero
            const productsByCashier = await prisma.$queryRaw`SELECT u.username AS cashierName, p.name AS productName, SUM(ps.quantity) AS quantitySale FROM Product p INNER JOIN ProductSale ps ON p.id = ps.productId INNER JOIN Sale s ON ps.saleId = s.id INNER JOIN User u ON u.id = s.userId WHERE DATE(s.date) = ${newdate} AND u.id = ${userId} GROUP BY u.id, p.id`
            const groupResult = {}

            productsByCashier.forEach((row) => {
                const { cashierName, productName, quantitySale } = row
                if (!groupResult[cashierName]) {
                    groupResult[cashierName] = []
                }
                groupResult[cashierName].push({ product: productName, quantity: quantitySale })
            })

            const sales = await prisma.sale.findMany({
                where: {
                    userId: userId,
                    date: newdate
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
                    userId: userId,
                    method: {
                        equals: 'Cash'
                    },
                    date: new Date(date)
                }
            })
            const transfers = await prisma.sale.findMany({
                where: {
                    userId: userId,
                    method: {
                        equals: 'Transfer'
                    },
                    date: new Date(date),
                }
            })

            const expenses = await prisma.expense.findMany({
                where: {
                    userId: userId,
                    date: new Date(date)
                }
            })


            const dailySale = sales.reduce((total, sale) => total + sale.total, 0)
            const onCash = cashes.reduce((total, sale) => total + sale.total, 0)
            const onTransfer = transfers.reduce((total, sale) => total + sale.total, 0)
            const dailyExpense = expenses.reduce((total, expense) => total + expense.total, 0)
            const dailyReport = [{
                dailySale: dailySale,
                onCash: onCash,
                onTransfer: onTransfer,
                dailyExpense: dailyExpense
            },
                groupResult]
            res.status(200).json({ message: "success", data: dailyReport, status: "ok" })
        }

    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)

    }
}

const reportByCashier = async (req, res) => {
    try {
        const date = req.params.date
        const newdate = new Date(date)
        //const quantityByProduct = await prisma.$queryRaw`SELECT p.name AS productName, SUM(ps.quantity) AS quantitySale FROM Product p INNER JOIN ProductSale ps ON p.id = ps.productId INNER JOIN Sale s ON ps.saleId = s.id WHERE DATE(s.date) = ${newdate} GROUP BY p.name`
        const productsByCashier = await prisma.$queryRaw`SELECT u.username AS cashierName, p.name AS productName, SUM(ps.quantity) AS quantitySale FROM Product p INNER JOIN ProductSale ps ON p.id = ps.productId INNER JOIN Sale s ON ps.saleId = s.id INNER JOIN User u ON u.id = s.userId WHERE DATE(s.date) = ${newdate} GROUP BY u.id, p.id`

        const groupResult = {}

        productsByCashier.forEach((row) => {
            const { cashierName, productName, quantitySale } = row
            if (!groupResult[cashierName]) {
                groupResult[cashierName] = []
            }
            groupResult[cashierName].push({ product: productName, quantity: quantitySale })
        })

        res.status(200).json({ message: "success", data: groupResult, status: "ok" })
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

module.exports = {
    dailyReport,
    reportByCashier
}