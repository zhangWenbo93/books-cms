const { User } = require('@models/user')
const { Book } = require('@models/book')
const { Contents } = require('@models/contents')
const { Result } = require('@lib/result')
const { CreateValidator, FileNameValidator } = require('@validator')

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
        const body = v.parsed.body
        const { userId, role } = ctx.state.auth
        const user = await User.getUserInfo(userId, role)
        if (user.username) {
            body.username = user.username
        }
        const book = await Book.createBook(body)
        if (book) {
            if (body.content && body.content.length > 0) {
                await Contents.addContents(body.contents)
                new Result('创建成功').success(ctx)
            } else {
                await Book.delBook(body)
                new Result('创建失败').success(ctx)
            }
        } else {
            new Result('创建失败').success(ctx)
        }
    }

    async getFileNameBook(ctx) {
        const v = await new FileNameValidator().validate(ctx)
        const book = await Book.getFileNameBook(v.get('path.fileName'))
        const contents = await Contents.getFileNameContents(v.get('path.fileName'))
        new Result({ ...book, ...contents }, '查询成功').success(ctx)
    }
    async getBookList(ctx) {
        const list = await Book.getBookList()
        new Result({ list }, '查询成功').success(ctx)
    }
}

module.exports = new BooksCtl()
