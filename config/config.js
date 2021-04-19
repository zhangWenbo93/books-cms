module.exports = {
    databases: {
        dbName: 'books-cms',
        host: '60.205.207.86',
        prot: 3306,
        user: 'root',
        password: '123456',
        dialectOptions: {
            socket: '/tmp/mysql.sock'
        }
    },
    security: {
        secretKey: 'UVxV3T-qwBKr3r?wGOwZ#wI$bjJ394L8oC=b%DIuMP#as_',
        expiresIn: 60 * 60
    }
}
