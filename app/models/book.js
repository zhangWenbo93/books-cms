const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const fs = require('fs')
const xml2js = require('xml2js').parseString
const Epub = require('@core/epub')
const { sequelize } = require('@core/db')

class Book extends Model {
    constructor(file, data) {}
}

Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'book'
        // timestamps: false
    }
)

module.exports = { Book }
