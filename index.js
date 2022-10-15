const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3002;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });
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


db.query(`SELECT * FROM department`, (err, rows) => {
    console.log(rows);
  });

// Create a department
// const sql = `INSERT INTO department (id, name)
//                VALUES (?,?)`;
// const params = [5, 'Marketing'];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});