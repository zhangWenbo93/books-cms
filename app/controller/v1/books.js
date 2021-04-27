const { Book } = require('@models/book')
const { Result } = require('@lib/result')
const { CreateValidator } = require('@validator')

class BooksCtl {
    async upload(ctx) {
        const file = ctx.request.files.file
        if (!file || file.length === 0) {
            new Result('上传电子书失败').fail(ctx)
        } else {
            const book = await Book.parse(file)
            new Result(book, '上传成功').success(ctx)
        }
    }

    async createBook(ctx) {
        const v = await new CreateValidator().validate(ctx)
        const book = Book.createBook(v.parsed.body)
        if (!book) {
            new Result('创建失败').success(ctx)
        } else {
            new Result('创建成功').success(ctx)
        }
    }
}

module.exports = new BooksCtl()
