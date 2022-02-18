const Sequelize = require('sequelize');

require('dotenv').config({path: '../.env'})

module.exports =  new Sequelize(
    {
        database: process.env.NAME,
        username: process.env.DBUSER,
        password: process.env.PASSWORD,
        host: process.env.SERVER,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: true,
            }
        },
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }
);
