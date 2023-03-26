const express = require("express")
const user = require("./routes/user");
const product = require("./routes/product")
const port = process.env.PORT || 3000

require("./database/database")

const app = express()

app.use(express.json())

app.get("/", (req,res) =>{
    res.send({message:"palacio de las papas"})
})

app.use("/users", user)
app.use("/products", product)

app.listen(port, () =>{
    console.log("server is running on port:", port)
})

