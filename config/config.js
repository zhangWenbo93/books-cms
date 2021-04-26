function envDir() {
    const isDev = process.env.NODE_ENV !== 'production'
    return isDev ? '/Users/zhangwenbo' : '/root'
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
        uploadPath: `${envDir()}/upload/admin-upload-ebook`,
        uploadUrl: 'http://localhost:8089/admin-upload-ebook'
    }
}
