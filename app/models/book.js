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
        fileName: DataTypes.STRING,
        cover: DataTypes.STRING,
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        publisher: DataTypes.STRING,
        bookId: DataTypes.STRING,
        language: DataTypes.STRING,
        rootFile: DataTypes.STRING,
        originalName: DataTypes.STRING,
        path: DataTypes.STRING,
        filePath: DataTypes.STRING,
        unzipPath: DataTypes.STRING,
        coverPath: DataTypes.STRING,
        createUser: DataTypes.STRING,
        createDt: {
            type: DataTypes.DATE,
            defaultValue: new Date().getTime()
        },
        updateDt: {
            type: DataTypes.DATE,
            defaultValue: new Date().getTime()
        },
        updateType: {
            type: DataTypes.DATE,
            defaultValue: new Date().getTime()
        },
        updateDt: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        sequelize,
        tableName: 'book',
        timestamps: false
    }
)

module.exports = { Book }
