const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // your MySQL username,
        user: 'root',
        // your MySQL password
        password: 'password',
        database: 'tracker'
    },
    console.log('Connected to the tracker database.')
)

module.exports = db;