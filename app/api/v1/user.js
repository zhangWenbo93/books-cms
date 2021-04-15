const Router = require('koa-router')
const router = new Router({ prefix: '/v1/user' })
const { login } = require('@controller/v1/user')

router.post('/login', login)

module.exports = router
