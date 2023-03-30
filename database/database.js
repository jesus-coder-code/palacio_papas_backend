const Sequelize = require("sequelize");
const userModel = require("../models/user.model");
const productModel = require("../models/product.model")
const blacklistModel = require("../models/blacklist.model")

const sequelize = new Sequelize("jesusdaniel_palaciopapas", "304693_jesus", "51246380",{
    host: "mysql-jesusdaniel.alwaysdata.net",
    dialect: "mysql"
})

const User = userModel(sequelize, Sequelize)
const Product = productModel(sequelize, Sequelize)
const Blacklist = blacklistModel(sequelize, Sequelize)

sequelize.sync({ force: false }).then(() => {
    console.log("conectado");
  });

module.exports ={
    User,
    Product,
    Blacklist
}