const { User } = require('@models/user')
const { LoginValidator, RegisterValidator } = require('@validator')
const { Result } = require('@lib/result')
const { generateToken } = require('@core/util')
const { handleRole } = require('@core/util')

class UserCtl {
    async register(ctx, body) {
        const v = await new RegisterValidator().validate(ctx)
        const user = {
            username: v.get('body.username'),
            password: v.get('body.password'),
            role: +v.get('body.role'),
            nickname: v.get('body.username')
        }
        await User.create(user)
        new Result('注册成功').success(ctx)
    }

    async login(ctx, next) {
        const v = await new LoginValidator().validate(ctx)
        const username = v.get('body.username')
        const password = v.get('body.password')

        const user = await User.validateUser(username, password)
        const token = generateToken(user.id, user.role)
        new Result({ token }, '登录成功').success(ctx)
    }

    async userInfo(ctx, next) {
        const { userId, role } = ctx.state.auth
        const user = await User.getUserInfo(userId, role)
        user.setDataValue('roles', handleRole(user.role))
        new Result(user, '登录成功').success(ctx)
    }
}

module.exports = new UserCtl()
