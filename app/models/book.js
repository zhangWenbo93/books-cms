const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const fs = require('fs')
const path = require('path')
const Epub = require('@core/epub')
const { sequelize } = require('@core/db')
const { EpubParse } = require('@core/epubParse')
const { createBookFromFile, createBookFromData, generateFile, reset, generateCoverUrl } = require('@core/util')
const { uploadDir: { uploadPath, uploadUrl } } = require('@config')
const { Contents } = require('@models/contents')

class Book extends Model {
    // 解析书籍
    static async parse(file) {
        const basicData = createBookFromFile(file)
        const epubData = await EpubParse.parse(file)
        return { ...basicData, ...epubData }
    }

    // 创建书籍
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

    // 更新书籍
    static async updateBook(data) {
        const book = await Book.getFileNameBook(data.fileName)
        if (+book.updateType === 0) {
            throw new global.errs.Forbbiden('内置电子书无法更新')
        }
        const updateData = createBookFromData(data)
        return await Book.update({ ...updateData }, { where: { id: book.id } })
    }

    // 获取特定书籍
    static async getBook({ title, author, publisher }) {
        const book = await Book.findOne({
            where: {
                [Op.and]: { title, author, publisher }
            }
        })
        return book
    }

    // 获取指定书籍
    static async getFileNameBook(fileName) {
        const book = await Book.findOne({
            where: {
                fileName
            },
            raw: true
        })
        return book
    }

    // 获取户籍列表
    static async getBookList(params) {
        const { page, pageSize, order = 'ASC' } = params
        const { count, rows } = await Book.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize, //第x页*每页个数
            order: [['id', order]],
            where: {
                [Op.and]: Book._genSqlValue(params)
            },
            raw: true
        })
        return { count, list: Book._genBookListCover(rows) }
    }

    // 文件删除
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

    // 分类视图查询
    static async getCategory() {
        const sql = 'select * from category order by category asc'
        const result = await sequelize.query(sql, {
            attributes: ['category', 'categoryText'],
            raw: true,
            type: sequelize.QueryTypes.SELECT
        })
        return result
    }

    static _genBookListCover(list) {
        return list.map(v => {
            v.cover = generateCoverUrl(v)
            return v
        })
    }

    static _genSqlValue(params) {
        const { title, author, category } = params
        return {
            ...(title && { title: { [Op.like]: `%${title}%` } }),
            ...(author && { author: { [Op.like]: `%${author}%` } }),
            ...(category && { category })
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
