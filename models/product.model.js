module.exports = (sequelize, type) =>{
    return sequelize.define("products",{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true, 
            allowNull: false
        },

        name:{
            type: type.STRING,
            allowNull: false
        },

        price:{
            type: type.INTEGER,
            allowNull: false,
        },

        category: {
            type: type.STRING,
            allowNull: false
        }
    })
}