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
                    "Add Department",
                    "View All Employees by Manager",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "View All Roles",
                    "Exit App"
                ],
            },
        ])

        .then(function (answer) {
            switch (answer.Generate) {
                case "View All Employee Information":
                    displayAllInfo();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "View All Employees by Departments":
                    viewAllbyDept();
                    break;
                case "Add Department":
                    addDepartment();
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
                case "Exit App":
                    connection.end();
                    break;
            }
        }
        )
}

// Creating functions for Each Answer

// function to display everything
function displayAllInfo() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee JOIN role on employee.role_id = role.id JOIN department ON role.department_id = department.id;", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking();
    })
}

// function to view all employees
function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking()
    })
}

// function to view all departments
function viewAllbyDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking();
    });
}

function addDepartment() {
    console.log("Follow the prompt to add a new Department:\n");
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the department name?",
                name: "department",
            },
        ])
        .then(function (answer) {
            //console.log(answer.department);
            var query = connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.department,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(
                        res.affectedRows + " New Department has been successfully added!\n"
                    );
                    startTracking();
                }
            );
        });
}

// function to view all employees by manager 
function viewAllbyManager() {
    connection.query("SELECT * FROM manager_id", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking();
    });
}

// function to add an employee
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

//   function to remove an employee
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

//   function to update employee role
function updateEmployeeRole() {
    console.log("Follow prompts to update Role: \n");
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter employee's id:",
                name: "employee_id",
            },
        ])
        .then(function (answer) {
            const employeeId = answer.employee_id;
            if (employeeId) {
                inquirer
                    .prompt([
                        {
                            type: "list",
                            message: "Enter employee new role:",
                            choices: [
                                "Director",
                                "Finance/Dept Manager",
                                "Team Manager",
                                "Representative",
                                "Sales Support",
                                "Human Resources"
                            ],
                            name: "role_type",
                        },
                        {
                            type: "input",
                            message: "Enter new salary:",
                            name: "salary",
                        },
                        {
                            type: "input",
                            message: "Enter department ID:",
                            name: "dept_id",
                        },
                    ])
                    .then(function (answer) {
                        const roleType = answer.role_type;
                        const salary = answer.salary;
                        const deptId = answer.dept_id;

                        var query = connection.query(
                            "UPDATE role SET ? WHERE ?",
                            [
                                {
                                    title: roleType,
                                    salary: salary,
                                    department_id: deptId,
                                },
                                {
                                    id: employeeId,
                                },
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " Role updated!\n");
                            }
                        );
                    });
            }
        });
}


// Need to insert update manager
async function updateEmployeeManager() {
    let emp = [];

    await connection.query("SELECT * FROM employee", function (err, res) {
        //console.log(res);
        emp = res;

        const empChoice = emp.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id
        }));

        inquirer
            .prompt([
                {
                    type: "list",
                    message: "Select employee you want to update manager for",
                    choices: empChoice,
                    name: "empId",
                }]).then(function (res) {
                    const m = connection.query("SELECT * FROM employee WHERE id !=" + parseInt(res.empId));
                    const mChoice = m.map(({ id, first_name, last_name }) => ({
                        name: first_name + " " + last_name,
                        value: id
                    }));

                    //     inquirer
                    //     .prompt([
                    // {

                    //   type: "list",
                    //   message: "Select manager",
                    //   choices: mChoice,
                    //   name: "mId",
                    // }]).then(function(mres){
                    //     connection.query("UPDATE employee SET manager_id="+parseInt(mres.mId)+" WHERE id="+parseInt(res.empId), function(err, data){
                    //         if(err) throw err;
                    //         startTracking();
                    //     });
                    //  });
                })
    });


}
// Function to view all roles
function viewAllRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        startTracking();
    });
}
