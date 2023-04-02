const {Sales} = require("../database/database")

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

    }catch(error){
        const sale = await Sales.findAll()
        if(sale){
            //res.json(sale)
            res.status(200).json({data:sale, message:"success"})
        }
        else{
            res.json({message:"sin registro de ventas"})
        }
    }
}

module.exports = {
    createSale,
    getSale
}