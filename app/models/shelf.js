const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@core/db')

class Shelf extends Model {}

Shelf.init(
    {
        fileName: DataTypes.INSERT,
        openId: DataTypes.STRING,
        date: {
            type: DataTypes.DATE,
            defaultValue: new Date().getTime()
        }
    },
    {
        sequelize,
        tableName: 'shelf',
        timestamps: false
    }
)

module.exports = { Shelf }
