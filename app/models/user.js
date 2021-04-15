const { sequelize } = require('@core/db')
const { Sequelize, Model, DataTypes } = require('sequelize')

class User extends Model {
    static async validateUserNamePassword(username, password) {
        const user = await User.findOne({
            where: {
                username
            }
        })
        if (!user) {
            throw new global.errs.AuthFailed('用户不存在')
        }
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING,
        nickname: DataTypes.STRING,
        avatar: DataTypes.STRING
    },
    {
        sequelize,
        tableName: 'admin_user'
    }
)

module.exports = { User }
