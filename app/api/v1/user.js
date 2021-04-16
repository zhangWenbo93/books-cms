const Router = require('koa-router')
const router = new Router({ prefix: '/v1/user' })
const { register, login, userInfo } = require('@controller/v1/user')
const { Auth } = require('@middlewares/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/info', new Auth().m, userInfo)

module.exports = router
