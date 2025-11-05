const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Republic_C207',
    database: process.env.DB_NAME || 'seasonal_stitch'
});

connection.connect((err) => {
    if (err) throw err;
    console.log(' MySQL connected successfully');
});

module.exports = connection;
