class BooksCtl {
    async upload(ctx) {
        console.log('====================================')
        console.log('ctx', ctx)
        console.log('====================================')
        ctx.body = {
            status: 0
        }
    }
}

module.exports = new BooksCtl()
