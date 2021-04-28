const { Sequelize, Model, DataTypes, Op } = require('sequelize')
const { pick, _ } = require('lodash')
const { sequelize } = require('@core/db')

class Contents extends Model {
    static async addContents(contents) {
        if (contents && contents.length > 0) {
            const array = []
            for (let i = 0; i < contents.length; i++) {
                const content = contents[i]
                const _content = _.pick(content, [
                    'fileName',
                    'bookId',
                    'href',
                    'order',
                    'level',
                    'text',
                    'label',
                    'pid',
                    'navId'
                ])
                Contents.removeAttribute('id')
                const c = await Contents.create({
                    ..._content
                })
                array.push(c)
            }
            return array
        }
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

module.exports = { Contents }
