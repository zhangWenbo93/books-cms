const path = require('path')
const { Result } = require('@lib/result')
const { uploadDir: { uploadOrigin } } = require('@config')
class BooksCtl {
    async upload(ctx) {
        const file = ctx.request.files.file
        if (!file || file.length === 0) {
            new Result('上传电子书失败').fail(ctx)
        } else {
            const basename = path.basename(file.path)
            new Result({ url: `${uploadOrigin}${basename}` }, '上传成功').success(ctx)
        }
    }
}

module.exports = new BooksCtl()
