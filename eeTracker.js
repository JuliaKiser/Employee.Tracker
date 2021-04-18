const mysql = require("mysql");
const inquirer = require("inquirer");

// Creates connection to mySQL
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Jgoolia10!",
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

// Creating functions for Each Answer

function displayAllInfo() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee JOIN role on employee.role_id = role.id JOIN department ON role.department_id = department.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking();
    })
}

function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking()
    })
}

function viewAllbyDept() {
    connection.query("SELECT * FROM department.name", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking();
    });
}

function viewAllbyManager() {
    connection.query("SELECT * FROM employee.manager_id", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking();
    });
}

function addEmployee() {
    console.log("Follow prompts to add new employee:\n");
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter employee's first name:",
          name: "employee_first_name",
        },
        {
          type: "input",
          message: "Enter employee's last name:",
          name: "employee_last_name",
        },
        {
          type: "input",
          message: "Enter employee's single digit role id number:",
          name: "role_id",
        },
        {
          type: "confirm",
          message: "Is the employee a manager?",
          name: "manager",
        },
      ])
      .then(function (answer) {
        const firstName = answer.employee_first_name;
        const lastName = answer.employee_last_name;
        const roleId = answer.role_id;
        const isManager = answer.manager;
  
        if (isManager) {
          inquirer
            .prompt([
              {
                type: "input",
                message: "What is the manager ID?",
                name: "manager_id",
              },
            ])
            .then(function (answer) {
              var query = connection.query(
                "INSERT INTO employee SET ?",
                {
                  first_name: firstName,
                  last_name: lastName,
                  role_id: roleId,
                  manager_id: answer.manager_id,
                },
                function (err, res) {
                  if (err) throw err;
                  console.log(
                    res.affectedRows +
                      " New Employee has been successfully added!\n"
                  );
                  startTracking();
                }
              );
            });
        } else {
          var query = connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.employee_first_name,
              last_name: answer.employee_last_name,
              role_id: answer.role_id,
            },
            function (err, res) {
              if (err) throw err;
              console.log(
                res.affectedRows + " New Employee has been successfully added!\n"
              );
              startTracking();
            }
          );
        }
      });
  }
  function removeEmployee() {
    console.log("Follow prompt to delete Employee: \n");
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter the employee ID to be deleted?",
          name: "delete_employee",
        },
      ])
      .then(function (answer) {
        var employee = answer.delete_employee;
        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            id: employee,
          },
          function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee deleted!\n");
            startTracking();
          }
        );
      });
  }