const { HttpException } = require('@core/http-exception')

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        const isHttpException = error instanceof HttpException
        const isDev = process.env.NODE_ENV !== 'production'
        if (isDev && !isHttpException) {
            throw error
        }
        if (isHttpException) {
            // 已知错误，即已定义的错误
            ctx.body = {
                msg: error.msg,
                err_code: error.errorCode,
                request: `${ctx.method}${ctx.path}`
            }
            ctx.status = error.code
        } else {
            // 未知的  未定义的错误
            ctx.body = {
                msg: '未知异常😂',
                err_code: 999,
                request: `${ctx.method}${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError
