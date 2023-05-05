const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const dailyReport = async (req, res) =>{
    try{
        const date = req.params.date
        const totalSales = await prisma.sale.aggregate({
            _sum:{
                total: true
            },
            where:{
                date: new Date(date)
            }

        })
        const totalCourtesy = await prisma.courtesy.aggregate({
            _sum:{
                total: true
            },
            where:{
                date: new Date(date)
            }
        })
        const report = [{totalSales: totalSales, totalCourtesy: totalCourtesy}]
        //res.status(200).json({totalSales: totalSales, totalCourtesy:totalCourtesy})
        res.status(200).send(report)
    }catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)

    }
}

module.exports = {
    dailyReport
}