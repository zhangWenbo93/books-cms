const Router = require('koa-router')
const { get } = require('lodash')
const requireDirectory = require('require-directory')

class InitManager {
    static initCore(app) {
        InitManager.app = app
        InitManager.initLoadRouter()
        InitManager.initLoadError()
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

    static initLoadError() {
        const errors = require('./http-exception')
        global.errs = errors
    }
}

module.exports = InitManager
