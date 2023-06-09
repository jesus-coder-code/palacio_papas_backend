const {PrismaClient} = require("@prisma/client")
const jwt = require("jsonwebtoken")


const prisma = new PrismaClient()

const newExpense = async (req, res) =>{
    try{
        const token = req.headers['verification']
        let auth = {}
        if(!token){
            return res.status(401).json({message:"no se proporcionó un token"})
        }
        auth = jwt.decode(token, "secretKey")
        req.userId = auth.userId
        const userId = req.userId
        const {description, total} = req.body
        const expense = await prisma.expense.create({
            data:{
                description,
                total,
                user:{
                    connect:{
                        id: userId
                    }
                }
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
            res.status(200).json({message:"success", data: expense, status:"ok"})
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