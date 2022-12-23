const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// prompt the user for their command
promptUser = () => {
  console.log(`
  ==============
  `)
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View All Departments', 
                  'View All Roles', 
                  'View All Employees', 
                  'Add Department',
                  'Add Role',
                  'Add Employee',
                  'Update an Employee Role',
                  'Quit'],
      }])
      .then(function (response) {
        // console.log(response);

        if (response.choice === 'View All Departments') {
          viewDepartments();
        } else if (response.choice === 'View All Roles') {
          viewRoles();
        } else if (response.choice === 'View All Employees') {
          viewEmployees();
        } else if (response.choice === 'Add Department') {
          addDepartment();
        } else if (response.choice === 'Add Role') {
          addRole();
        } else if (response.choice = 'Add Employee') {
          addAEmployee();
        } else if (response.choice = 'Update an Employee Role') {
          updateRole();
        } else if (response.choice = 'Quit') {
          console.log("Thank you, have a great day! ");
          return;
        }
      });
};

// view all departments
viewDepartments = () => {
  console.log(`
  ===============
  All Departments
  ===============
  `);
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;

    // console.log (rows);
    console.table(rows);
    promptUser();
  });
};

// view all roles
const viewRoles = () => {
  console.log(`
  =========
  All Roles
  =========
  `);
  const sql = `SELECT role.id, role.title, department.department_name AS department, role.salary 
               FROM role 
               LEFT JOIN department ON role.depart_id = department.id`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    
    // console.log (rows);
    console.table(rows);
    promptUser();
  });
};

// view all employees
const viewEmployees = () => {
  console.log(`
  =============
  All Employees
  =============
  `);
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, role.title, department.department_name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employees
               LEFT JOIN role ON employees.role_id = role.id
               LEFT JOIN department ON role.depart_id = department.id
               LEFT JOIN employees manager ON employees.manager_id = manager.id`
  db.query(sql, (err, rows) => {
    if (err) throw err;

  console.table(rows);
  promptUser();
  });
};

// add department
const addDepartment = () => {
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

      promptUser();
    })
  })
};

// add role
const addRole = () => {
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

        promptUser();
      });
    });
    });
  });
};

// add employee
const addAEmployee = () => {
  inquirer.prompt([
    {
    type: 'input',
    name: 'firstName',
    message: "What is the first name of the employee?"
  },
  {
    type: 'input',
    name: 'lastName',
    message: "What is the last name of the employee?"
  }
  ])
  .then(answer => {
    const params = [answer.firstName, answer.lastName];

    // get role data from table
    const roleSql = `SELECT role.id, role.title
                 FROM role`;
    db.query(roleSql, (err, data) => {
      if (err) throw err;

      const role = data.map(({ id, title }) => ({ name: title, value: id }));

      inquirer.prompt([{
        type: 'list',
        name: 'roleName',
        message: "What is the role of the employee?",
        choices: role
      }
    ])
    .then(roleChoice => {
      const roleName = roleChoice.roleName;
      params.push(roleName);

      // get manager data from employees table
      const managerSql = `SELECT * FROM employees`;

      db.query(managerSql, (err, data) => {
        if (err) throw err;

        const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));

        inquirer.prompt([{
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: managers
        }])
        .then(managerChoice => {
          const managerName = managerChoice.managerName;
          params.push(managerName);

          const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                       VALUES (?, ?, ?, ?)`;
          db.query(sql, params, (err, result) => {
            if (err) throw err;
            console.log('Employee has been added!')

            viewEmployees();
          });
        });
      });
    });
    });
  });
};

// update an employee role
const updateRole = () => {
  // get list of employees
  const employeeSql = `SELECT first_name, last_name 
                 FROM employees`;
  db.query(employeeSql, (err, data) => {
                  if (err) throw err;
  const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + '' + last_name, value: id }));
  inquirer.prompt([
    {
      type: 'list',
      message: 'Which employees role do you want to update?',
      name: 'employeeName',
      choices: employees
    }
  ])

  
  })

  const roleChoices = `SELECT title
                  FROM role`;
    {
      type: 'input',
      message: 'Which role do you want to assign to the selected employee?',
      name: 'employeeRole',
      choices: roleChoices
    }
  ])
  .then(employChoice => {
    const role = employChoice.dept;
    params.push(role);

    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                 VALUES (?, ?, ?)`;
    db.query(sql, params, (err, result) => {
      if (err) throw err;
      console.log('Added ' + answer.roleName + ' to roles!');

      promptUser();
    });
  });
}
promptUser()
