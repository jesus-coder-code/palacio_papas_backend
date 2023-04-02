const {Category} = require("../database/database")

const createCategory = async (req, res) =>{
    try{
        const category = await Category.findAll({where: {name: req.params.name}})
        if(category){
            res.json({message:"esta categoria ya existe"})
        }
        else{
            await Category.create(req.body)
            res.json({message:"categoria creada"})
        }
    }catch(error){
        res.json({message:error})
    }
}


module.exports = {
    createCategory
}