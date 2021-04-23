const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@core/db')

class HotSearch extends Model {}

HotSearch.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        openId: DataTypes.STRING,
        keyword: DataTypes.STRING,
        create_dt: {
            type: DataTypes.DATE,
            defaultValue: new Date().getTime()
        }
    },
    {
        sequelize,
        tableName: 'hot_search',
        timestamps: false
    }
)

module.exports = { HotSearch }
