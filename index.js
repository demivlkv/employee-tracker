// import inquirer
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

const init = () => {
    console.log(`
----------------
EMPLOYEE MANAGER
----------------
    `);
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Quit']
        }
    ])
}

// initialize app
init();