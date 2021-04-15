class BooksCtl {
    async f(ctx) {
        ctx.body = {
            status: 0
        }
    }
}

module.exports = new BooksCtl()
