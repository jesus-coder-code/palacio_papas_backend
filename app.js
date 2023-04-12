const express = require("express")
const cors = require("cors")
const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const sale = require("./routes/sale")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const port = process.env.PORT || 3000
//require("./database/database")

const app = express()

app.use(cookieParser())

app.use(cors())
app.use(express.json())
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))

app.get("/", (req,res) =>{
    res.send({message:"palacio de las papas"})
})

app.use("/users", user)
app.use("/products", product)
app.use("/categories", category)
app.use("/sales", sale)

app.listen(port, () =>{
    console.log("server is running on port:", port)
})

