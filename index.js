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
        choices: ["View All Departments", 
                  "View All Roles", 
                  "View All Employees", 
                  "Add Department",
                  "Add Role",
                  "Quit"],
      })
      .then(function (response) {
        console.log(response);
        if (response.choice === "View All Departments") {
          // View all departments
          db.query(`SELECT * FROM department`, (err, rows) => {
            console.table(rows);
            promptEmployee();
          });
        }
    
        if (response.choice === "View All Roles") {
          // shows role table
          db.query(`SELECT role.id, role.title, department.department_name AS department, role.salary 
                    FROM role 
                    LEFT JOIN department ON role.depart_id = department.id`, (err, rows) => {
            console.table(rows);
            promptEmployee();
          });
        }
    
        if (response.choice === "View All Employees") {
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

        if (response.choice === "Add Department") {
          addDepartment();
        }

        if (response.choice === "Add Role") {
          addRole();
        }

        if (response.choice = "quit") {
            return;
        }
        
    
      });
};

// add department
addDepartment = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'addDept',
    message: "What department would you like to add?"
    }
  ])
  .then(answer => {
    const sql = `INSERT INTO department (department_name)
                 VALUES (?)`;
    db.query(sql, answer.addDept, (err, result) => {
      if (err) throw err;
      console.log('Added ' + answer.addDept + ' to Departments');

      promptEmployee();
    })
  })
};

// add role
addRole = () => {
  inquirer.prompt([{
    type: 'input',
    name: 'roleName',
    message: 'What is the name of the role you would like to add?'
  },
  {
    type: 'input',
    name: 'roleSalary',
    message: 'What is the salary of this role?'
  }
  ])
  .then(answer => {
    const params = [answer.roleName, answer.roleSalary];

    // get the departments from table
    const sql = `SELECT department_name, id 
                 FROM department`;

    db.query(sql, (err, data) => {
      if (err) throw err;

      const dept = data.map(({ id, department_name }) => ({ name: department_name, value: id }));

      inquirer.prompt([{
          type: 'list',
          name: 'dept',
          message: 'Which department does this role belong to?',
          choices: dept
      }
    ])
    .then(deptChoice => {
      const dept = deptChoice.dept;
      params.push(dept);

      const sql = `INSERT INTO role (title, salary, depart_id)
                   VALUES (?, ?, ?)`;
      db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log('Added ' + answer.roleName + ' to roles!');

        promptEmployee();
      });
    });
    });
  });
};

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
