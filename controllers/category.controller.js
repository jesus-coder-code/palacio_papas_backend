const {Category} = require("../database/database")

const createCategory = async (req, res) =>{
    try{
        await Category.create(req.body)
        res.json({message:"categoria creada"})
    }catch(error){
        res.json({message:error})
    }
}

const getCategory = async (req, res) =>{
    try{
        const category = await Category.findAll()
        if(category){
            //res.json(category)
            res.status(200).json({data:category, message:"success"})
        }
        else{
            res.json({message:"no hay categorias"})
        }
    } catch(error){
        res.json({message: error})
        console.log(error)
    }
}



module.exports = {
    createCategory,
    getCategory
}