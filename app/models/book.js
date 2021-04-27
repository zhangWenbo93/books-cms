const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const fs = require('fs')
const path = require('path')
const Epub = require('@core/epub')
const { sequelize } = require('@core/db')
const { EpubParse } = require('@core/epubParse')
const { generateFile } = require('@core/util')
const { uploadDir: { uploadPath, uploadUrl } } = require('@config')

class Book extends Model {
    static async parse(file) {
        const basicData = Book._createBookFromFile(file)
        const epubData = await EpubParse.parse(file)
        return { ...basicData, ...epubData }
    }

    static async createBook(data) {
        return await Book.create({
            ...data
        })
    }

    static async updateBook(data) {
        const basicData = Book._createBookFromData(this.data)
    }

    static _createBookFromFile(file) {
        const { basename, fileName, url, unzipUrl } = generateFile(file)
        return {
            fileName: fileName,
            path: `/book/${basename}`, // epub文件相对路径
            filePath: `/book/${basename}`, // epub文件路径
            url: url, // epub文件url
            title: '', // 标题
            author: '', // 作者
            publisher: '', // 出版社
            contents: [], // 目录
            cover: '', // 封面图片URL
            coverPath: '',
            category: -1, // 分类ID
            categoryText: '', // 分类名称
            language: '', // 语种
            unzipPath: `/unzip/${fileName}`, // 解压后的电子书目录
            unzipUrl: unzipUrl, // 解压后的电子书链接
            originalName: file.name // 原文件名
        }
    }

    static _createBookFromData(data) {
        return {
            fileName: data.fileName,
            cover: data.coverPath,
            title: data.title,
            author: data.author,
            publisher: data.publisher,
            bookId: data.fileName,
            language: data.language,
            rootFile: data.rootFile,
            originalName: data.originalName,
            path: data.path || data.filePath,
            filePath: data.path || data.filePath,
            unzipPath: data.unzipPath,
            coverPath: data.coverPath,
            createUser: data.username,
            createDt: new Date().getTime(),
            updateDt: new Date().getTime(),
            updateType: data.updateType === 0 ? data.updateType : UPDATE_TYPE_FROM_WEB,
            contents: data.contents
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
