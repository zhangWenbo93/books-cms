require('module-alias/register');

const path = require('path');
const Koa = require('koa');
const KoaBody = require('koa-body');
const KoaStatic = require('koa-static');
const InitManager = require('./core/init');

const app = new Koa();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || '3003';

InitManager.initCore(app);

app.listen(port, host, () => {
    console.log(`项目已启动在${host}:${port}`);
});
