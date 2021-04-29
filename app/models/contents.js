const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { pick, _ } = require('lodash')
const { sequelize } = require('@core/db')

class Contents extends Model {
    static async addContents(contents) {
        try {
            return Contents.bulkCreate(contents, { raw: true })
        } catch (err) {
            throw new global.errs.Forbbiden(err.message)
        }
    }

    static async getFileNameContents(fileName) {
        const contents = await Contents.findAll({
            where: {
                fileName
            }
        })
        const contentsTree = Contents._generateTree(contents)
        return { contents, contentsTree }
    }

    static _generateTree(array) {
        const trees = []
        array.forEach(v => {
            v.children = []
            // v.pid 不存在 说明这是一个一级目录
            if (v.pid === '') {
                trees.push(v)
            } else {
                // v.pid 存在 说明这是一个次级目录，我们需要找到它的父级目录
                // 找到 pid 相同的 父级目录， 并将当前目录存入 父级目录的 children
                const parent = array.find(_ => _.navId === v.pid)
                parent.children.push(v)
            }
        })
        return trees
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
