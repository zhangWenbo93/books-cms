const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = require('@core/db')

module.exports = sequelize.define(
    'category',
    {
        category: {
            field: 'id',
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        categoryText: DataTypes.STRING,
        num: DataTypes.INTEGER
    },
    {
        timestamps: false
    }
)
