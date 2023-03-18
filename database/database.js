const Sequelize = require("sequelize");
const userModel = require("../models/user.model");

const sequelize = new Sequelize("jesusdaniel_palaciopapas", "304693_jesus", "51246380",{
    host: "mysql-jesusdaniel.alwaysdata.net",
    dialect: "mysql"
})

const User = userModel(sequelize, Sequelize)

sequelize.sync({ force: false }).then(() => {
    console.log("conectado");
  });

module.exports ={
    User,
}