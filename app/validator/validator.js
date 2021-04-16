const { Rule, LinValidator } = require('@core/lin-validator')
const { User } = require('@models/user')
class LoginValidator extends LinValidator {
    constructor() {
        super()
        this.username = [new Rule('isLength', '用户名不能为空', { min: 1 })]
        this.password = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            })
        ]
    }
}

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.username = [new Rule('isLength', '用户名不能为空', { min: 1, max: 50 })]
        this.password = [
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            }),
            new Rule(
                'matches',
                '密码不符合规范',
                "^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,.#%'+*-:;^_`]+$)[,.#%'+*-:;^_`0-9A-Za-z]{6,20}$"
            )
        ]

        this.password2 = this.password
    }

    validatePassword(vals) {
        const { password, password2 } = vals.body
        if (password !== password2) {
            throw new global.errs.AuthFailed('两次密码不一致')
        }
    }

    async validateUserName(vals) {
        const { username } = vals.body
        const user = await User.findOne({
            where: {
                username
            }
        })

        if (user) {
            throw new global.errs.AuthFailed('用户已存在')
        }
    }
}

module.exports = {
    LoginValidator,
    RegisterValidator
}
