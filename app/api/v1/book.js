const Router = require('koa-router')
const router = new Router({ prefix: '/v1/book' })
const { f } = require('@controller/v1/books')

router.get('/', f)

module.exports = router
