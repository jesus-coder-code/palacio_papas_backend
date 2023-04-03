module.exports = (sequelize, type) => {
    return sequelize.define("sales", {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        product_name: {
            type: type.STRING,
            allowNull: false,
        },

        quantity: {
            type: type.INTEGER,
            allowNull: false,
        },

        amount: {
            type: type.INTEGER,
            allowNull: false,
        },

        /*sale_date: {
            type: type.DATE,
            allowNull: false
        }*/

    })
}