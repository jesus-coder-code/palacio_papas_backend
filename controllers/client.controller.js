const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient()

const createClient = async (req, res) =>{
    try{
        const {name} = req.body
        const found = await prisma.client.findFirst({
            where:{
                OR:[
                    {name: name.toLowerCase()}
                ]
            }
        })
        if(found){
            res.status(409).json({message:"este cliente ya existe"})
        }else{
            await prisma.client.create({data:req.body})
            res.status(200).json({message:"cliente registrado"})
        }
    }catch(error){
        res.status(500).json({message:"error intertno"})
        console.log(error)
    }
}

const getClients = async (req, res) =>{
    try{
        const clients = await prisma.client.findMany()
        if(clients){
            res.status(200).json({data:clients})
        }else{
            res.status(404).json({message:"sin clientes"})
        }
    }catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)
    }
}

const createCourtesy = async (req, res) =>{
    try{
        const {products} = req.body
        var total = 0
        const productCourtesy = []
        for (i of products){
            const {id, quantity} = i
            const productConsult = await prisma.product.findFirst({
                where:{
                    id
                }
            })
            const subtotal = quantity * productConsult.price
            total += subtotal
            productCourtesy.push({
                product: {connect:{id: id}},
                quantity: quantity,
                subtotal: subtotal
            })
        }
        const {clientId} = req.body
        const courtesy = await prisma.courtesy.create({
            data:{
                client: {connect:{id: clientId}},
                total: total, 
                products:{
                    create: productCourtesy
                }
            },
            include: {
                products:{
                    include:{
                        product: true
                    }
                }
            }
        })
        if(courtesy){
            res.status(200).json({message:"cortesia realizada"})
        }else{
            res.json(400).json({message:"no se creó la cortesia"})
        }
    }catch(error){
        res.status(500).json({message:"error interno"})
        console.log(error)
    }
}

module.exports = {
    createClient,
    getClients
}