const {Product} = require("../database/database")

const getProduct = async (req, res) =>{
    try{
        const product = await Product.findAll()
        res.json(product)
    } catch(error){
        res.json({message: error})
        console.log(error)
    }
}

const getProductByName = async (req, res) =>{
    try{
        const productName = await Product.findAll({where: {name: req.params.name}})
        res.json(productName)
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