const { Rule, LinValidator } = require('@core/lin-validator')

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

module.exports = {
    LoginValidator
}
