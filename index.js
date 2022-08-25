// import inquirer
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

// connect to database
db.connect(err => {
    if (err) throw err;

    // initialize app if successful connection
    console.log(`
--------------------------------
E M P L O Y E E    M A N A G E R
--------------------------------
    `);

    init();
});

// display menu for user
const init = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']
        }
    ])
    .then(choice => {
        if (choice.menu === 'View All Departments') {
            // display all departments
            const sql = `SELECT * FROM department`;
            db.query(sql, (err, res) => {
                if (err) throw err;
                console.table(res);

            // return to initial menu
            init();
        });
        } else if (choice.menu === 'View All Roles') {
            // display all roles
            const sql = `SELECT role.id, role.title, department.name AS department, role.salary
                        FROM role
                        LEFT JOIN department ON role.department_id = department.id`;
            db.query(sql, (err, res) => {
                if (err) throw err;
                console.table(res);
        
                init();
            });
        } else if (choice.menu === 'View All Employees') {
            // display all employees
            const sql = `SELECT e.id, e.first_name, e.last_name, role.title AS title, department.name AS department, role.salary AS salary, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'null') AS manager
                        FROM employee e
                        LEFT JOIN employee m ON e.manager_id = m.id
                        LEFT JOIN role ON e.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id`;
            db.query(sql, (err, res) => {
                if (err) throw err;
                console.table(res);
            
                init();
            });
        } else if (choice.menu === 'Add Department') {
            // add a new department
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'dept',
                    message: 'What is the name of the department?'
                }
            ])
            .then(data => {
                // add new department into database
                const sql = `INSERT INTO department (name)
                            VALUES ('${data.dept}')`;
                db.query(sql, (err, res) => {
                    if (err) throw err;
                    console.log(`Added ${data.dept} department to the database!`);

                    init();
                });
            });
        } else if (choice.menu === 'Add Role') {
            const sql = `SELECT * FROM department`;
            db.query(sql, (err, res) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'role',
                        message: 'What is the name of the role?'
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary of the role?'
                    },
                    {
                        type: 'list',
                        name: 'deptList',
                        message: 'Which department does the role belong to?',
                        choices: () => {
                            // display all options including newly-added departments
                            let deptArray = [];
                            for (let i = 0; i < res.length; i++) {
                                deptArray.push(res[i].name);
                            }
                            return deptArray;
                        }
                    }
                ])
                .then(data => {
                    // take the result & store it as a variable
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].name === data.deptList) {
                            var department = res[i];
                        }
                    }
                    // add a new role into database
                    const sql = `INSERT INTO role (title, salary, department_id)
                                VALUES (?,?,?)`;
                    const params = [data.role, data.salary, department.id];
                    db.query(sql, params, (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${data.role} role to the database!`);
                    
                        init();
                    });
                });
            });
        } else if (choice.menu === 'Add Employee') {
            const sql = `SELECT * FROM employee, role`;
            db.query(sql, (err, res) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "What is the employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "What is the employee's last name?"
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: () => {
                            // list all roles
                            
                        }
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: () => {
                            // list all employees
                            
                        }
                    },
                ])
                .then(data => {
                    // take the result & store it as a variable
                    // add a new employee into database
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                VALUES (?,?,?,?)`;
                    const params = [data.firstName, data.lastName, data.role, data.manager];
                    db.query(sql, params, (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${data.firstName} ${data.lastName} to the database!`);
                    
                        init();
                    });
                });
            });
        } else if (choice.menu === 'Update Employee Role') {
            updateEmployee();
        } else {
            console.log(`
----------------------------------
THANK YOU FOR USING THE APP. BYE !
----------------------------------
                `);
            db.close();
        }
    })
};