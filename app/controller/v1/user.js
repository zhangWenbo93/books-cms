const { User } = require('@models/user')
const { LoginValidator, RegisterValidator } = require('@validator')
const { Result } = require('@lib/result')

class UserCtl {
    async register(ctx, body) {
        const v = await new RegisterValidator().validate(ctx)
        const user = {
            username: v.get('body.username'),
            password: v.get('body.password'),
            role: v.get('body.role'),
            nickname: v.get('body.username')
        }
        await User.create(user)
        new Result('注册成功').success(ctx)
    }

    async login(ctx, next) {
        const v = await new LoginValidator().validate(ctx)
        const username = v.get('body.username')
        const password = v.get('body.password')

        await User.validateUser(username, password)
        new Result('登录成功').success(ctx)
    }

    async userInfo(ctx, next) {}
}

module.exports = new UserCtl()
