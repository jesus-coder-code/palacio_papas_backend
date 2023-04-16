const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const createCategory = async (req, res) =>{
    try{
        await prisma.category.create({data:req.body})
        res.json({message:"categoria creada"})
    }catch(error){
        res.json({message:error})
    }
}

const getCategory = async (req, res) =>{
    try{
        const category = await prisma.category.findMany()
        if(category){
            //res.json(category)
            res.status(200).json({data:category, message:"success"})
        }
        else{
            res.status(404).json({message:"no hay categorias"})
        }
    } catch(error){
        res.status(500).json({message: "error interno"})
        console.log(error)
    }
}

const updateCategory = async (req, res) =>{
    try{
        const {name, description} = req.body
        const {id} = req.params
        await prisma.category.update({
            where:{
                id: parseInt(id)
            },
            data:{
                name,
                description
            }
        })
        res.status(200).json({message:"categoria actualizada"})
    }catch(error){
        res.status(500).json({message:error})
        console.log(error)
    }
}

module.exports = {
    createCategory,
    getCategory,
    updateCategory
}