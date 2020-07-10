require('dotenv').config({silent: true})

module.exports = (function() {
    return {
        local: { // localhost
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '',
            database: ''
        },
        real: { // real server db info
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        },
        dev: { // dev server db info
            host: process.env.DEV_DB_HOST,
            port: process.env.DEV_DB_PORT,
            user: process.env.DEV_DB_USER,
            password: process.env.DEV_DB_PASS,
            database: process.env.DEV_DB_NAME
        }
    }
})();