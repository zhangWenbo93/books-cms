const BasicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { security: { secretKey } } = require('@config')

class Auth {
    get m() {
        return async (ctx, next) => {
            const userToken = BasicAuth(ctx.req)
            let decode = {}

            if (!userToken || !userToken.name) {
                throw new global.errs.Forbbiden('token不合法')
            }

            try {
                decode = jwt.verify(userToken.name, secretKey)
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    throw new global.errs.TokenOverdue('token已过期')
                }
            }

            ctx.state.auth = {
                userId: decode.uid,
                role: decode.scope
            }

            await next()
        }
    }
}

module.exports = { Auth }
