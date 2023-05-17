const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const getProduct = async (req, res) =>{
    try{
        const product = await prisma.product.findMany()
        if(product){
            res.status(200).json({data:product, message:"success"})
            
        }
        else{
            res.status(404).json({message:"sin productos"})
        }
    } catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)
    }
}

const getProductByName = async (req, res) =>{
    try{
        const {name} = req.params
        const productName = await prisma.product.findMany({
            where:{
                name
            }
        })
        if(productName){
            res.status(200).json({data:productName, message:"success"})
        }
        else{
            res.status(404).json({message:"no se ha encontrado este producto"})
        }
    } catch (error) {
        res.status(500).json({message: error})
        console.log(error)
    }
}

const createProduct = async (req, res) =>{
    try{
        const {name, price, stock, type,categoryId} = req.body
        await prisma.product.create({
            data: {
                name,
                price,
                stock,
                type,
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        })
        res.status(200).json({message:"producto creado"})
    }catch(error){
        res.status(500).json({message: error})
        console.log(error)

    }
}

const updateProduct = async (req, res) =>{
    try{
        const {name, price, stock} = req.body
        const {id} = req.params
        await prisma.product.update({
            where:{
                id: parseInt(id)
            },
            data:{
                name, 
                price,
                stock
            }
        })
        res.status(200).json({message:"producto actualizado"})
    }catch(error){
        res.status(500).json({message:"error al actualizar el producto"})
        console.log(error)
    }
}


module.exports = {
    getProduct,
    getProductByName,
    createProduct,
    updateProduct
}