const {Product} = require("../database/database")

const getProduct = async (req, res) =>{
    try{
        const product = await Product.findAll()
        if(product){
            /*const data = [
                product
            ]*/
            //res.json({status:"success", data:{product}, message:"todos los productos"})
            res.status(200).json({data:product, message:"success"})
            //res.status(200).send({data:product})
            
        }
        else{
            res.json({message:"sin productos"})
        }
    } catch(error){
        res.json({message: error})
        console.log(error)
    }
}

const getProductByName = async (req, res) =>{
    try{
        const productName = await Product.findAll({where: {name: req.params.name}})
        if(productName){
            res.json(productName)
        }
        else{
            res.json({message:"no se ha encontrado este producto"})
        }
    } catch (error) {
        res.json({message: error})
        console.log(error)
    }
}

const createProduct = async (req, res) =>{
    try{
        await Product.create(req.body)
        res.json({message:"producto creado"})
    }catch(error){
        res.json({message: error})
        console.log(error)

    }
}

const updateProduct = async (req, res) =>{
    try{
        await Product.update(req.body, {where: {id: req.params.id}})
        res.json({message: "producto actualizado"})
    }catch(error){
        res.json({message: error})
        console.log(error)

    }
}


module.exports = {
    getProduct,
    getProductByName,
    createProduct,
    updateProduct
}