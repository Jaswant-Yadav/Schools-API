const mysql = require("mysql");

const connectdb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database:'schools'
});

connectdb.connect((err) => {
    if(err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Successfully connected to database");
});

module.exports = connectdb;