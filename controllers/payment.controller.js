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
            res.status(200).json({message:"success", data: payment, status:"ok"})

        }else{
            res.status(404).json({message:"sin pagos registrados"})
        }
    }catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)
    }
}

const deletePayment = async (req, res) => {
    try {
        const { id } = req.params
        const deletePayment = await prisma.payment.delete({
            where: {
                id: parseInt(id)
            },
        })
        if(deletePayment){
            res.status(200).send({message:"pago eliminado"})
        }else{
            res.status(400).send({message:"error al eliminar el pago"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "error interno" })
    }
}

module.exports = {
    newPayment,
    getPayments,
    deletePayment
}