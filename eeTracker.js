const mysql = require("mysql");
const inquirer = require("inquirer");

// Creates connection to mySQL
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "eetracker_db",
});

// Connects to mySQL
connection.connect(err => {
    if (err) {
        throw (err)
    }
    console.log('Successfully Connected!');
    startTracking();
})

// Employee Tracking
function startTracking() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What action would you like to take?",
                name: "Generate",
                choices: ["View All Employee Information",
                    "View All Employees",
                    "View All Employees by Departments",
                    "View All Employees by Manager",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "View All Roles",
                    "Delete Role",
                    "Delete Department",
                    "Exit App"
                ],
            },
        ])

        .then(function (answer) {
            switch (answer.generate) {
                case "View All Employee Information":
                    displayAllInfo();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Employees by Departments":
                    viewAllbyDept();
                    break;
                case "View All Employees by Manager":
                    viewAllbyManager();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Delete Role":
                    deleteRole();
                    break;
                case "Delete Department":
                    deleteDept();
                    break;
                case "Exit App":
                    connection.end();
                    break;
            }
        }
        )
}