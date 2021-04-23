const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const fs = require('fs')
const path = require('path')
const xml2js = require('xml2js').parseString
const Epub = require('@core/epub')
const { sequelize } = require('@core/db')
const { uploadDir: { booksDir, uploadOrigin } } = require('@config')

class Book extends Model {
    static async addBook(file, data) {
        const params = Book.createBookFromFile(file)
        // try {
        //     return await Book.create({
        //         fileName: 'name',
        //         title: '223',
        //         ...params
        //     })
        // } catch (error) {
        //     console.log(error)
        // }
    }

    static async updateBook(data) {
        const params = Book.createBookFromData(this.data)
    }

    static createBookFromFile(file) {
        const basename = path.basename(file.path) // 文件上传名
        const dirname = path.dirname(file.path) // 本地文件路径
        const extname = path.extname(file.path) // 后缀
        const fileName = basename.replace(extname, '') // 文件无后缀的name
        const url = `${uploadOrigin}/book/${basename}` // 下载URL
        const unzipPath = `${booksDir}/unzip/${fileName}` // 解压后文件夹路径
        const unzipUrl = `${uploadOrigin}/unzip/${fileName}` // 解压后文件夹路径URL
        if (!fs.existsSync(unzipPath)) {
            fs.mkdirSync(unzipPath, { recursive: true }) // 创建电子书解压后的目录
        }
        const createParams = {
            fileName: fileName,
            path: `/book/${basename}`, // epub文件相对路径
            filePath: `/book/${basename}`, // epub文件路径
            url: url, // epub文件url
            title: '', // 标题
            author: '', // 作者
            publisher: '', // 出版社
            contents: [], // 目录
            cover: '', // 封面图片URL
            category: -1, // 分类ID
            categoryText: '', // 分类名称
            language: '', // 语种
            unzipPath: `/unzip/${fileName}`, // 解压后的电子书目录
            unzipUrl: unzipUrl, // 解压后的电子书链接
            originalName: file.name // 原文件名
        }
        return createParams
    }

    static createBookFromData(data) {
        const params = {
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

        return params
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
