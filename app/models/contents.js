const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { pick, _ } = require('lodash')
const { sequelize } = require('@core/db')
const { generateTree } = require('@core/util')

class Contents extends Model {
    // 电子书目录入库
    static async addContents(contents) {
        return Contents.bulkCreate(contents, { raw: true })
    }

    static async getFileNameContents(fileName) {
        const contents = await Contents.findAll({
            order: ['order'],
            where: {
                fileName
            },
            raw: true // 只返回数据库查询结果
        })
        const contentsTree = generateTree(contents)
        return { contents, contentsTree }
    }
}

Contents.init(
    {
        fileName: DataTypes.STRING,
        bookId: DataTypes.STRING,
        href: DataTypes.STRING,
        order: DataTypes.INTEGER,
        level: DataTypes.INTEGER,
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

Contents.removeAttribute('id')

module.exports = { Contents }
