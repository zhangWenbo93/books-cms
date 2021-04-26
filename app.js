require('module-alias/register')
const path = require('path')
const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')
const InitManager = require('@core/init')
const catchError = require('@middlewares/exception')
const { uploadDir: { uploadPath } } = require('@config')

const app = new Koa()
const isDev = process.env.NODE_ENV === 'production'
const host = isDev ? '0.0.0.0' : process.env.HOST || '127.0.0.1'
const port = process.env.PORT || '3003'

app.use(catchError)
app.use(
    KoaBody({
        multipart: true,
        formidable: {
            uploadDir: path.resolve('./', `${uploadPath}/book/`),
            keepExtensions: true // 保留拓展名
        }
    })
)
// 初始化自动加载路由
InitManager.initCore(app)

app.listen(port, host, () => {
    console.log('项目已启动在 http://%s:%s', host, port)
})
