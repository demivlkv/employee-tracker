const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Tvoisyabr06.',
        database: 'company'
    },
    console.log('Connected to the company database')
);

module.exports = db;