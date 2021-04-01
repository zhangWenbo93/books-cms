const Router = require('koa-router');
const { get } = require('lodash');
const requireDirectory = require('require-directory');

class InitManager {
    static initCore(app) {
        InitManager.app = app;
        InitManager.initLoadRouter();
    }

    static initLoadRouter() {
        requireDirectory(module, `${process.cwd()}/app/api`, {
            visit: whenModuleLoad
        });

        function whenModuleLoad(route) {
            if (route instanceof Router) {
                InitManager.app.use(route.routes()).use(route.allowedMethods());
            }
        }
    }
}

module.exports = InitManager;
