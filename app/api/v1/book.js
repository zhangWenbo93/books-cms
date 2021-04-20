const Router = require('koa-router')
const router = new Router({ prefix: '/v1/book' })
const { upload } = require('@controller/v1/books')
const { Auth } = require('@middlewares/auth')

router.post('/upload', new Auth().m, upload)

module.exports = router
