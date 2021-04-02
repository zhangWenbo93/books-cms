const { Sequelize, Model } = require('sequelize');
const { databases: { dbName, host, prot, user, password } } = require('@config');

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true,
    timezone: '+08:00',
    define: {
        paranoid: true,
        underscore: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ['updatedAt', 'deletedAt', 'createdAt']
                }
            },
            timestamps: true
        }
    }
});

module.exports = { sequelize };
