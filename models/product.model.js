module.exports = (sequelize, type) =>{
    return sequelize.define("products",{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name:{
            type: type.STRING
        },

        price:{
            type: type.INTEGER
        },

        quantity:{
            type: type.INTEGER
        },

        category:{
            type:type.STRING
        }
    })
}