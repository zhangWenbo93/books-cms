const { ResultType } = require('./enum')

class Result {
    constructor(data, msg = '操作成功', options) {
        this.data = null
        if (arguments.length === 0) {
            this.msg = '操作成功'
        } else if (arguments.length === 1) {
            this.msg = data
        } else {
            this.data = data
            this.msg = msg
            if (options) {
                this.options = options
            }
        }
    }

    createResult() {
        if (!this.code) {
            this.code = ResultType.CODE_SUCCESS
        }
        let base = {
            code: this.code,
            msg: this.msg
        }
        if (this.data) {
            base.data = this.data
        }
        if (this.options) {
            base = { ...base, ...this.options }
        }
        return base
    }

    json(ctx) {
        ctx.body = this.createResult()
    }

    success(ctx) {
        this.code = ResultType.CODE_SUCCESS
        this.json(ctx)
    }

    fail(ctx) {
        this.code = ResultType.CODE_ERROR
        this.json(ctx)
    }
}

module.exports = { Result }
