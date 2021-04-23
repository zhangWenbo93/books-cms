const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@core/db')

class Rank extends Model {}

Rank.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fileName: DataTypes.INSERT,
        openId: DataTypes.STRING,
        rank: DataTypes.INTEGER,
        create_dt: {
            type: DataTypes.BIGINT,
            defaultValue: new Date().getTime()
        }
    },
    {
        sequelize,
        tableName: 'rank',
        timestamps: false
    }
)

module.exports = { Rank }
