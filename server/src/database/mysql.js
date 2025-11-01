const mysql = require('mysql2/promise'); // Using the promise-based API for async/await
const logger = require('../utils/logging');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

pool.getConnection()
    .then(connection => {
        logger.info('Database connected');
        connection.release();
    })
    .catch(err => {
        logger.error('Error connecting to the database: ', err);
    });

module.exports = pool;
