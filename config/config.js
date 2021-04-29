const isDev = process.env.NODE_ENV !== 'production'

const envDir = isDev => {
    return isDev ? '/Users/zhangwenbo' : '/root'
}

const coverUrl = isDev => {
    return isDev ? 'https://book.youbaobao.xyz/book/res/img' : 'https://book.youbaobao.xyz/admin-upload'
}

module.exports = {
    databases: {
        dbName: 'books-cms',
        host: 'localhost',
        prot: 3306,
        user: 'root',
        password: '123456',
        dialectOptions: {
            socket: '/tmp/mysql.sock'
        }
    },
    security: {
        secretKey: 'UVxV3T-qwBKr3r?wGOwZ#wI$bjJ394L8oC=b%DIuMP#as_',
        expiresIn: 60 * 60 * 24 * 30
    },
    uploadDir: {
        uploadPath: `${envDir(isDev)}/upload/admin-upload-ebook`,
        uploadUrl: 'http://localhost:8089/admin-upload-ebook',
        oldUploadUrl: coverUrl(isDev)
    }
}
