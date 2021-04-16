const Router = require('koa-router')
const router = new Router({ prefix: '/v1/user' })
const { register, login } = require('@controller/v1/user')

router.post('/register', register)
router.post('/login', login)

module.exports = router
