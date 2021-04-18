const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'Jgoolia10!',
    database: 'database name'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});