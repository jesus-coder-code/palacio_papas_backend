const Products = require("../models/product.model")
const Sales = require("../models/sales.model")
const Category = require("../models/category.model")

//relacion de producto y ventas
//un producto tendrá una o mas ventas
Products.hasMany(Sales, {
    as: "ventas",
    foreignKey: "product_id"
})
Sales.belongsTo(Products, {as: "categoria"})

//relacion categoria y productos
//una categoría tendrá uno o mas productos
Category.hasMany (Products, {
    as: "productos",
    foreignKey: "category_id"
})
Products.belongsTo(Category, {as: "categoria"})
