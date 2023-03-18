const express = require("express")
const user = require("./routes/user");
const port = process.env.PORT || 5000

require("./database/database")

const app = express()

app.use(express.json())

app.get("/", (req,res) =>{
    res.send({message:"palacio de las papas"})
})

app.use("/user", user)

app.listen(port, () =>{
    console.log("server is running on port:", port)
})

