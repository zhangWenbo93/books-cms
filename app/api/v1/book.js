const Router = require('koa-router');
const router = new Router({ prefix: '/' });
const { f } = require('@controller/v1/books');

router.get('/', ctx => {
    ctx.body = f();
});

module.exports = router;
