USE eetracker_db;

INSERT INTO department (name)
VALUES ("Accounts Payable"),
("Human Resources"),
("IT"),
("Customer Support"),
("Payroll"),
("Time Collections"),
("Audit/Compliance");

INSERT INTO role (title, salary, department_id)
VALUES ("Director", 90000, 1),
("Finance/Dept Manager", 75000, 1),
("Team Manager", 50000, 2),
("Team Lead", 40000, 2),
("Representative", 25000, 3),
("Sales Support", 75000, 4),
("Human Resources", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Daniel", "Long", 1, 1234),
("Deena", "Canals", 2, NULL),
("Brian", "Stucky", 1, 2345),
("Dara", "McDonald", 4, NULL),
("Sarah", "Fishero", 3, NULL),
("Jade", "Mason", 3, NULL);