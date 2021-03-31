const Router = require('koa-router');
const router = new Router({ prefix: '/' });

router.get('/', ctx => {
    ctx.body = '这是主页';
});

module.exports = router;
