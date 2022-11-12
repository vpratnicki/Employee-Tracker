const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// prompt the user for their command
function promptEmployee() {
    inquirer
      .prompt({
        type: "list",
        name: "choice",
        message: "what do you want",
        choices: ["view all departments", "view all roles", "view all employees", "quit"],
      })
      .then(function (response) {
        console.log(response);
        if (response.choice === "view all departments") {
          // View all departments
          db.query(`SELECT * FROM department`, (err, rows) => {
            console.table(rows);
            promptEmployee();
          });
        }
    
        if (response.choice === "view all roles") {
          // shows role table
          db.query(`SELECT role.id, role.title, department.department_name AS department, role.salary 
                    FROM role 
                    LEFT JOIN department ON role.depart_id = department.id`, (err, rows) => {
            console.table(rows);
            promptEmployee();
          });
        }
    
        if (response.choice === "view all employees") {
          // shows employee table
          db.query(`SELECT employees.id, employees.first_name, employees.last_name, role.title, department.department_name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
                    FROM employees
                    LEFT JOIN role ON employees.role_id = role.id
                    LEFT JOIN department ON role.depart_id = department.id
                    LEFT JOIN employees manager ON employees.manager_id = manager.id`, (err, rows) => {
            console.table(rows);
            promptEmployee();
          });
        }
    
        if (response.choice = "quit") {
            return;
        }
        
    
      });

}

promptEmployee()


// // view table in sql that combines roles and departments:
// db.query(`SELECT role.*, department.department_name
// FROM role
// LEFT JOIN department ON role.depart_id = department.id`, (err, rows) => {
//     console.table(rows);
// });

// //  SELECT employees.id, employees.first_name, role.title FROM employees LEFT JOIN role ON employees.role_id = role.id;

// // Create a department
// // const sql = `INSERT INTO department (id, name)
// //                VALUES (?,?)`;
// // const params = [5, 'Marketing'];

// // db.query(sql, params, (err, result) => {
// //     if (err) {
// //         console.log(err);
// //     }
// //     console.log(result);
// // });
