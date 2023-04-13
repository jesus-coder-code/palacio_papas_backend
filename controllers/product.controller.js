const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const getProduct = async (req, res) =>{
    try{
        const product = await prisma.product.findMany()
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
            res.json({message:"no se ha encontrado este producto"})
        }
    } catch (error) {
        res.json({message: error})
        console.log(error)
    }
}

const createProduct = async (req, res) =>{
    try{
        const category = req.body.category
        const product = req.body.product
        //const {categoryName} = req.body
        await prisma.category.create({
            data: category
        })

        await prisma.product.create({
            data: product
        })

        /*const {name, price, quantity, categoryId} = req.body
        await prisma.product.create({
            data:{
                name,
                price,
                quantity,
                category:{connect:{
                    id: categoryId
                }}
            }
        })*/
        res.json({message:"producto creado y categoria creada"})
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