const express = require("express")
const cors = require("cors")
const user = require("./routes/user");
const product = require("./routes/product");
const category = require("./routes/category");
const sale = require("./routes/sale")
const cookieParser = require("cookie-parser")
const session = require("express-session");
const clients = require("./routes/client");
const reports = require("./routes/report");
const payments = require("./routes/payment");
const expense = require("./routes/expense");
const port = process.env.PORT || 3000
//require("./database/database")
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')

const app = express()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
app.use("/clients", clients)
app.use("/reports", reports)
app.use("/payments", payments)
app.use("/expense", expense)

app.listen(port, () =>{
    console.log("server is running on port:", port)
})

