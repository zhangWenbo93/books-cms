const Router = require('koa-router')
const cors = require('koa2-cors')
const { get } = require('lodash')
const requireDirectory = require('require-directory')

class InitManager {
    static initCore(app) {
        InitManager.app = app
        InitManager.initLoadRouter()
        InitManager.initLoadError()
        InitManager.initCors()
    }

    static initLoadRouter() {
        requireDirectory(module, `${process.cwd()}/app/api`, {
            visit: whenModuleLoad
        })

        function whenModuleLoad(route) {
            if (route instanceof Router) {
                InitManager.app.use(route.routes()).use(route.allowedMethods())
            }
        }
    }

    static initCors() {
        InitManager.app.use(
            cors({
                maxAge: 5, //指定本次预检请求的有效期，单位为秒。
                credentials: true, //是否允许发送Cookie
                allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
                allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
                exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
            })
        )
    }

    static initLoadError() {
        const errors = require('./http-exception')
        global.errs = errors
    }
}

module.exports = InitManager
