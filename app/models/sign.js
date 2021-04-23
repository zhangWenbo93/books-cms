const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@core/db')

class Sign extends Model {}

Sign.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        openId: DataTypes.STRING,
        create_dt: {
            type: DataTypes.DATE,
            defaultValue: new Date().getTime()
        }
    },
    {
        sequelize,
        tableName: 'sign',
        timestamps: false
    }
)

module.exports = { Sign }
