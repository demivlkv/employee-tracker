INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Account Manager', 160000, 3),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Peter', 'Parker', 1, null),
('Harry', 'Osborn', 2, 1),
('Curt', 'Connors', 3, null),
('Otto', 'Octavius', 4, 3),
('Norman', 'Osborn', 5, null),
('Max', 'Dillon', 6, 5),
('J. Jonah', 'Jameson', 7, null),
('Eddie', 'Brock', 8, 7);
