const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const newExpense = async (req, res) =>{
    try{
        const {description, total} = req.body
        const expense = await prisma.expense.create({
            data:{
                description,
                total
            }
        })
        if(expense){
            res.status(200).json({message:"gasto registrado"})
        }else{
            res.status(400).json({message:"error al registrar el gasto"})
        }
    }catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)
    }
}

const getExpense = async (req, res) =>{
    try{
        const expense = await prisma.expense.findMany()
        if(expense){
            res.status(200).send(expense)
        }
    }catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)
    }
}

module.exports = {
    newExpense,
    getExpense
}