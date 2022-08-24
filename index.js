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
            viewDepts();
        } else if (choice.menu === 'View All Roles') {
            viewRoles();
        } else if (choice.menu === 'View All Employees') {
            viewEmployees();
        } else if (choice.menu === 'Add Department') {
            addDept();
        } else if (choice.menu === 'Add Role') {
            addRole();
        } else if (choice.menu === 'Add Employee') {
            addEmployee();
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

// view all departments
const viewDepts = () => {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, res) => {
        if (err) throw err;

        console.table(res);

        // display initial menu
        init();
    });
};

// view all departments
const viewRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary
                FROM role
                LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;

        console.table(res);

        // display initial menu
        init();
    });
};

// view all departments
const viewEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, employee.manager_id AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id`;
    db.query(sql, (err, res) => {
        if (err) throw err;

        console.table(res);

        // display initial menu
        init();
    });
};