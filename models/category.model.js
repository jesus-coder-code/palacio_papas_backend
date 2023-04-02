module.exports = (sequelize, type) =>{
    return sequelize.define ("category", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        name: {
            type: type.STRING,
            allowNulL: false
        }
    })
}