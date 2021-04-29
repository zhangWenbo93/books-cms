const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const fs = require('fs')
const path = require('path')
const Epub = require('@core/epub')
const { sequelize } = require('@core/db')
const { EpubParse } = require('@core/epubParse')
const { createBookFromFile, createBookFromData, generateFile, reset } = require('@core/util')
const { uploadDir: { uploadPath, uploadUrl } } = require('@config')
const { Contents } = require('@models/contents')

class Book extends Model {
    static async parse(file) {
        const basicData = createBookFromFile(file)
        const epubData = await EpubParse.parse(file)
        return { ...basicData, ...epubData }
    }

    static async createBook(data) {
        const book = await Book.getBook(data)
        if (book) {
            await Book.delBook(data)
            throw new global.errs.Forbbiden('电子书已存在')
        } else {
            const params = createBookFromData(data)
            return await Book.create({ ...params })
        }
    }

    static async updateBook(data) {
        const basicData = createBookFromData(data)
    }

    static async getBook({ title, author, publisher }) {
        const book = await Book.findOne({
            where: {
                [Op.and]: { title, author, publisher }
            }
        })
        return book
    }

    static async getFileNameBook(fileName) {
        const book = await Book.findOne({
            where: {
                fileName
            },
            raw: true
        })
        return book
    }

    // static async getBook({ title, author, publisher }) {
    //     const book = await Book.findOne({
    //         where: {
    //             [Op.or]: { title, author, publisher }
    //         }
    //     })
    //     return book
    // }

    // static async getBookList({ title, author, publisher }) {
    static async getBookList() {
        return await Book.findAll({
            where: {}
        })
    }

    static async delBook(data) {
        // 删除文件所在文件夹
        reset(data)
        if (data.fileName) {
            await Book.destroy({
                where: {
                    fileName: data.fileName
                }
            })
            await Contents.destroy({
                where: {
                    fileName: data.fileName
                }
            })
        }
    }
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
        category: DataTypes.INTEGER,
        categoryText: DataTypes.STRING,
        language: DataTypes.STRING,
        rootFile: DataTypes.STRING,
        originalName: DataTypes.STRING,
        filePath: DataTypes.STRING,
        unzipPath: DataTypes.STRING,
        coverPath: DataTypes.STRING,
        createUser: DataTypes.STRING,
        createDt: {
            type: DataTypes.BIGINT,
            defaultValue: new Date().getTime()
        },
        updateDt: {
            type: DataTypes.BIGINT,
            defaultValue: new Date().getTime()
        },
        updateType: {
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
