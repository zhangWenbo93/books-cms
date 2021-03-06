const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@core/db')

class HotBook extends Model {}

HotBook.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        openId: DataTypes.STRING,
        title: DataTypes.STRING,
        fileName: DataTypes.STRING,
        create_dt: {
            type: DataTypes.BIGINT,
            defaultValue: new Date().getTime()
        }
    },
    {
        sequelize,
        tableName: 'hot_book',
        timestamps: false
    }
)

module.exports = { HotBook }
