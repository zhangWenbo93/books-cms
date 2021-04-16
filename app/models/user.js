const bcrypt = require('bcryptjs')
const { sequelize } = require('@core/db')
const { Sequelize, Model, DataTypes, Op } = require('sequelize')

class User extends Model {
    static async validateUser(username, password) {
        const user = await User.findOne({
            where: {
                username
            }
        })
        if (!user) {
            throw new global.errs.AuthFailed('用户不存在')
        }
        const correct = bcrypt.compareSync(password, user.password)
        if (!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        }
        return user
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
        password: {
            type: DataTypes.STRING,
            set(val) {
                const salt = bcrypt.genSaltSync(10)
                const pwd = bcrypt.hashSync(val, salt)
                this.setDataValue('password', pwd)
            }
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'admin'
        },
        nickname: DataTypes.STRING,
        avatar: {
            type: DataTypes.STRING,
            defaultValue: 'http://60.205.207.86:3001/uploads/upload_b03faa538b990b6db4546c8e4e91be60.jpg'
        }
    },
    {
        sequelize,
        tableName: 'admin_user',
        timestamps: false
    }
)

module.exports = { User }
