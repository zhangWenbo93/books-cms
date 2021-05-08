const Router = require('koa-router')
const router = new Router({ prefix: '/v1/book' })
const { upload, createBook, updateBook, getBookList, getFileNameBook, getCategory } = require('@controller/v1/books')
const { Auth } = require('@middlewares/auth')

router.post('/upload', new Auth().m, upload)
router.post('/create', new Auth().m, createBook)
router.post('/update', new Auth().m, updateBook)
router.post('/list', new Auth().m, getBookList)
router.get('/fileName/:fileName', new Auth().m, getFileNameBook)
router.get('/category', new Auth().m, getCategory)

module.exports = router
