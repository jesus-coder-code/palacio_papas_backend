module.exports = (sequelize, type) =>{
    return sequelize.define("users",{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,    
        },

        email:{
            type: type.STRING
        },

        user: {
            type:type.STRING
        },

        password: {
            type: type.STRING
        }
    })
}