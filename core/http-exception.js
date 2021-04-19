/**
 * @description 继承来自Node自身的错误属性
 * @date 2021-04-01
 * @class HttpException
 * @extends {Error}
 */
class HttpException extends Error {
    constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
        super()
        this.msg = msg
        this.errorCode = errorCode
        this.code = code
    }
}
/**
 * @description 资源未找到
 * @date 2021-04-01
 * @class NotFound
 * @extends {HttpException}
 */
class NotFound extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '资源未找到'
        this.errorCode = errorCode || 10001
        this.code = 404
    }
}
/**
 * @description 参数不正确
 * @date 2021-04-01
 * @class ParameterException
 * @extends {HttpException}
 */
class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '参数不正确'
        this.errorCode = errorCode || 10002
        this.code = 400
    }
}
/**
 * @description 接口请求成功
 * @date 2021-04-01
 * @class Success
 * @extends {HttpException}
 */
class Success extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || 'ok'
        this.errorCode = errorCode || 0
        this.code = 201
    }
}
/**
 * @description 无权限访问
 * @date 2021-04-01
 * @class Forbbiden
 * @extends {HttpException}
 */
class Forbbiden extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '禁止访问'
        this.errorCode = errorCode || 10006
        this.code = 403
    }
}

class AuthFailed extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10004
        this.code = 401
    }
}

class TokenOverdue extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.msg = msg || 'token已过期'
        this.errorCode = errorCode || 10006
        this.code = 200
    }
}

module.exports = {
    HttpException,
    NotFound,
    ParameterException,
    Success,
    Forbbiden,
    AuthFailed,
    TokenOverdue
}
