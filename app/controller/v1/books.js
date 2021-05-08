const { User } = require('@models/user')
const { Book } = require('@models/book')
const { Contents } = require('@models/contents')
const { Result } = require('@lib/result')
const { CreateValidator, FileNameValidator, ListQueryValidator } = require('@validator')
const { generateCoverUrl } = require('@core/util')

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
        const params = v.parsed.body
        const { userId, role } = ctx.state.auth
        const user = await User.getUserInfo(userId, role)
        if (user.username) {
            params.username = user.username
        }
        const book = await Book.createBook(params)
        if (book) {
            if (params.content && params.content.length > 0) {
                await Contents.addContents(params.contents)
                new Result('创建成功').success(ctx)
            } else {
                await Book.delBook(params)
                new Result('创建失败').success(ctx)
            }
        } else {
            new Result('创建失败').success(ctx)
        }
    }

    async updateBook(ctx) {
        const v = await new CreateValidator().validate(ctx)
        const params = v.parsed.body
        const { userId, role } = ctx.state.auth
        const user = await User.getUserInfo(userId, role)
        if (user.username) {
            params.username = user.username
        }
        const book = await Book.updateBook(params)
        if (book) {
            new Result('更新成功').success(ctx)
        } else {
            new Result('更新失败').success(ctx)
        }
    }

    async getFileNameBook(ctx) {
        const v = await new FileNameValidator().validate(ctx)
        const book = await Book.getFileNameBook(v.get('path.fileName'))
        const contents = await Contents.getFileNameContents(v.get('path.fileName'))
        book.cover = generateCoverUrl(book)
        new Result({ ...book, ...contents }, '查询成功').success(ctx)
    }
    async getBookList(ctx) {
        const v = await new ListQueryValidator().validate(ctx)
        const params = v.parsed.body
        const list = await Book.getBookList(params)
        new Result({ ...list }, '查询成功').success(ctx)
    }

    async getCategory(ctx) {
        const category = await Book.getCategory()
        new Result(category, '查询成功').success(ctx)
    }
}

module.exports = new BooksCtl()
