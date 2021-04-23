const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { sequelize } = require('@core/db')

class Contents extends Model {}

Contents.init(
    {
        fileName: DataTypes.STRING,
        id: DataTypes.STRING,
        href: DataTypes.STRING,
        order: DataTypes.INSERT,
        level: DataTypes.INSERT,
        text: DataTypes.STRING,
        label: DataTypes.STRING,
        pid: DataTypes.STRING,
        navId: DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'contents',
        timestamps: false
    }
)

module.exports = { Contents }
