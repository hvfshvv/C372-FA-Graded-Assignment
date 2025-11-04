const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Republic_C207', 
    database: 'seasonal_stitch'
});

connection.connect((err) => {
    if (err) throw err;
    console.log(' MySQL connected successfully');
});

module.exports = connection;
