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
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Update Employee Managers', 'View Employees by Department', 'Delete Department', 'Delete Role', 'Delete Employee', 'Quit']
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
            const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'null') AS manager
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
            const sql = `SELECT * FROM role`;
            db.query(sql, (err, roles) => {
                if (err) throw err;

                db.query(`SELECT * FROM employee`, (err, managers) => {
                    if (err) throw err;
                    // create list of managers for employee
                    managers = managers.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }));
                    managers.push({ name: 'None' });

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
                            choices: roles.map(role => ({ name: role.title, value: role.id }))
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        },
                    ])
                    .then(data => {
                        // return 'null' if employee has no manager
                        if (data.manager === 'None') {
                            data.manager = null;
                        }

                        // add new employee into database
                        const sql = `INSERT INTO employee SET ?`;
                        const params = { first_name: data.firstName, last_name: data.lastName, role_id: data.role, manager_id: data.manager };

                        db.query(sql, params, (err, res) => {
                            if (err) throw err;
                            console.log(`Added ${data.firstName} ${data.lastName} to the database!`);
                        
                            init();
                        });
                    });
                });
            });
        } else if (choice.menu === 'Update Employee Role') {
            const sql = `SELECT * FROM role`;
            db.query(sql, (err, roles) => {
                if (err) throw err;

                db.query(`SELECT * FROM employee`, (err, employees) => {
                    if (err) throw err;
                    // create list of managers for employee
                    employees = employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: "Which employee's role do you want to update?",
                            choices: employees
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Which role do you want to assign the selected employee?',
                            choices: roles.map(role => ({ name: role.title, value: role.id }))
                        }
                    ])
                    .then(data => {
                        // update employee role in database
                        const sql = `UPDATE employee SET ? WHERE ?`;
                        const params = [{ role_id: data.role }, { id: data.employee }];

                        db.query(sql, params, (err, res) => {
                            if (err) throw err;
                            console.log(`Updated employee's role in the database!`);
                        
                            init();
                        });
                    });
                });
            });
        } else if (choice.menu === 'Update Employee Managers') {
            const sql = `SELECT * FROM employee`;
            db.query(sql, (err, employees) => {
                if (err) throw err;

                db.query(sql, (err, managers) => {
                    if (err) throw err;
                    managers = managers.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }));
                    managers.push({ name: 'None' });

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: "Which employee's manager do you want to update?",
                            choices: employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(data => {
                        // return 'null' if employee has no manager
                        if (data.manager === 'None') {
                            data.manager = null;
                        }

                        // update employee's manager in database
                        const sql = `UPDATE employee SET ? WHERE ?`;
                        const params = [{ manager_id: data.manager }, { id: data.employee }];

                        db.query(sql, params, (err, res) => {
                            if (err) throw err;
                            console.log(`Updated employee's manager in the database!`);
                        
                            init();
                        });
                    });
                });
            });
        } else if (choice.menu === 'View Employees by Department') {
            const sql = `SELECT * FROM department`;
            db.query(sql, (err, departments) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'sortDept',
                        message: 'Which department of employees would you like to view?',
                        choices: departments.map(department => ({ name: department.name, value: department.id }))
                    }
                ])
                .then(data => {
                    // display employees by department
                    const sql = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department
                                FROM employee e
                                JOIN role ON e.role_id = role.id
                                JOIN department ON role.department_id = department.id
                                WHERE department.id = ?`;
                    
                    db.query(sql, data.sortDept, (err, res) => {
                        if (err) throw err;
                        console.table(res);
                
                        init();
                    });
                });
            });
        } else if (choice.menu === 'Delete Department') {
            const sql = `SELECT * FROM department`;
            db.query(sql, (err, departments) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'deleteDept',
                        message: 'Which department would you like to delete?',
                        choices: departments.map(department => ({ name: department.name, value: department.id }))
                    }
                ])
                .then(data => {
                    // remove department by id
                    const sql = `DELETE FROM department
                                WHERE department.id = ?`;
                    
                    db.query(sql, data.deleteDept, (err, res) => {
                        if (err) throw err;
                        console.log(`Deleted department from the database!`);
                
                        init();
                    });
                });
            });
        } else if (choice.menu === 'Delete Role') {
            const sql = `SELECT * FROM role`;
            db.query(sql, (err, roles) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'deleteRole',
                        message: 'Which role would you like to delete?',
                        choices: roles.map(role => ({ name: role.title, value: role.id }))
                    }
                ])
                .then(data => {
                    // remove role by id
                    const sql = `DELETE FROM role
                                WHERE role.id = ?`;
                    
                    db.query(sql, data.deleteRole, (err, res) => {
                        if (err) throw err;
                        console.log(`Deleted role from the database!`);
                
                        init();
                    });
                });
            });
        } else if (choice.menu === 'Delete Employee') {
            const sql = `SELECT * FROM employee`;
            db.query(sql, (err, employees) => {
                if (err) throw err;

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'deleteEmp',
                        message: 'Which department would you like to delete?',
                        choices: employees.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }))
                    }
                ])
                .then(data => {
                    // remove employee by id
                    const sql = `DELETE FROM employee
                                WHERE employee.id = ?`;
                    
                    db.query(sql, data.deleteEmp, (err, res) => {
                        if (err) throw err;
                        console.log(`Deleted employee from the database!`);
                
                        init();
                    });
                });
            });
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