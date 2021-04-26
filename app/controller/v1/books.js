const { Book } = require('@models/book')
const { Result } = require('@lib/result')

class BooksCtl {
    async upload(ctx) {
        const file = ctx.request.files.file
        if (!file || file.length === 0) {
            new Result('上传电子书失败').fail(ctx)
        } else {
            const book = await Book.addBook(file)
            new Result(book, '上传成功').success(ctx)
        }
    }
}

module.exports = new BooksCtl()
