module.exports = (sequelize, type) => {
    return sequelize.define ("blacklist", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        token:{
            type: type.STRING,
            allowNull: false
        },

        expiredAt: {
            type: type.DATE,
            allowNull: true
        }
    })
}