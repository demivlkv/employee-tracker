// import inquirer
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

// connect to database
db.connect(err => {
    if (err) throw err;

    // initialize app if successful connection
    console.log(`
----------------
EMPLOYEE MANAGER
----------------
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
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']
        }
    ])
    .then(choice => {
        if (choice === 'View All Departments') {
            viewDepartments();
        } else if (choice === 'View All Roles') {
            viewRoles();
        } else if (choice === 'View All Employees') {
            viewEmployees();
        } else if (choice === 'Add a Department') {
            addDepartment();
        } else if (choice === 'Add a Role') {
            addRole();
        } else if (choice === 'Add an Employee') {
            addEmployee();
        } else if (choice === 'Update an Employee Role') {
            updateEmployee();
        } else {
            console.log(`
-----------------
EXITING APP. BYE!
-----------------
                `);
        }
    })
};