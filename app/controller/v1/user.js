const { User } = require('@models/user')
const { LoginValidator } = require('@validator')
const { Result } = require('@lib/result')

class UserCtl {
    async login(ctx, next) {
        const v = await new LoginValidator().validate(ctx)
        const username = v.get('body.username')
        const password = v.get('body.password')
        if (username === 'admin' && password === '111111') {
            new Result('登录成功').success(ctx)
        } else {
            new Result('登录失败').fail(ctx)
        }
    }

    async userInfo(ctx, next) {}
}

module.exports = new UserCtl()
