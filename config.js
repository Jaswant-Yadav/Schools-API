const mysql = require("mysql");

const connectdb = mysql.createConnection({
    host: process.env.DB_HOST  ,
    user: process.env.DB_USER ,
    password:process.env.DB_PASSWORD || '',
    database:process.env.DB_NAME
});

connectdb.connect((err) => {
    if(err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Successfully connected to database");
});

module.exports = connectdb;