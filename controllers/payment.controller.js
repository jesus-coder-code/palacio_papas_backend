const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const newPayment = async (req, res) => {
    try {
        const { total } = req.body
        const payment = await prisma.payment.create({
            data: {
                total
            }
        })

        if(payment){
            res.status(200).json({message:"pago a empleados registrado"})

        }else{
            res.status(400).json({message:"error al registrar pago"})
        }

    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const getPayments = async (req, res) => {
    try{
        const payment = await prisma.payment.findMany()
        if(payment){
            res.status(200).json({data:payment, message:"success"})

        }else{
            res.status(404).json({message:"sin pagos registrados"})
        }
    }catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)
    }
}

module.exports = {
    newPayment,
    getPayments
}