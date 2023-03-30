module.exports = (sequelize, type) => {
    return sequelize.define ("blacklist", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false,
        },

        jti: {
            type: type.STRING,
            allowNull: false
        }
    })
}