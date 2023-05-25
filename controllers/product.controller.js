const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const multer = require("multer")
const FormData = require("form-data")



/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Carpeta de destino para guardar las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});*/


const getProduct = async (req, res) => {
    try {
        const product = await prisma.product.findMany({
            orderBy: {
                id: "desc"
            }
        })
        if (product) {
            res.status(200).json({ data: product, message: "success" })

        }
        else {
            res.status(404).json({ message: "sin productos" })
        }
    } catch (error) {
        res.status(500).json({ message: "error interno" })
        console.log(error)
    }
}

const getProductByName = async (req, res) => {
    try {
        const { name } = req.params
        const productName = await prisma.product.findMany({
            where: {
                name
            }
        })
        if (productName) {
            res.status(200).json({ data: productName, message: "success" })
        }
        else {
            res.status(404).json({ message: "no se ha encontrado este producto" })
        }
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)
    }
}


const createProduct = async (req, res) => {
    try {
        const { name, price, stock, type, categoryId } = req.body
        const filename = req.files
        const jsonString = JSON.stringify(filename)
        const bytes = new TextEncoder().encode(jsonString)
        //const image = req.file
        /*console.log(req.file);
        const response = await fetch("http://localhost:3000/products/createProduct", {
            method:"POST",
            body:form
        })
        const product = await prisma.product.create({
            data:{
                name: response.name,
                price: response.price,
                stock: response.data.name,
                type: response.data.name,
                category: response.data.name,
                image: response.image
            }
        })*/
        const product = await prisma.product.create({
            data:{
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                type,
                category:{
                    connect:{
                        id:parseInt(categoryId)
                    }
                },
                image:bytes
            }
        })
        if(product){
            res.status(200).json({message:"producto creado"})
            console.log(bytes)
        }
    } catch (error) {
        res.status(500).json({ message: error })
        console.log(error)

    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, price, stock, type, categoryId } = req.body
        const { id } = req.params
        await prisma.product.update({
            where: {
                id: parseInt(id)
            },
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
        res.status(200).json({ message: "producto actualizado" })
    } catch (error) {
        res.status(500).json({ message: "error al actualizar el producto" })
        console.log(error)
    }
}


module.exports = {
    getProduct,
    getProductByName,
    createProduct,
    updateProduct
}