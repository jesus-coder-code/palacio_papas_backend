
const createSale = async (req, res) =>{
    try{
        await Sales.create(req.body)
        res.json({message:"venta creada satisfactoriamente"})
    }catch(error){
        res.json({message:error})
        console.log(error)
    }
}

const getSale = async (req, res) => {
    try{
        const sale = await Sales.findAll()
        if(!sale){
            res.json({message:"sin registro de ventas"})
        }
        else{
            res.status(200).json({data:sale, message:"success"})
        }
    }catch(error){
        res.json({message:error})
        console.log(error)
    }
}

module.exports = {
    createSale,
    getSale
}