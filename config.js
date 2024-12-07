const mysql = require("mysql");

const connectdb = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'schools',
    port: process.env.DB_PORT || 5000,
    ssl: process.env.DB_SSL ? {
        rejectUnauthorized: false
    } : false
});

connectdb.connect((err) => {
    if(err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Successfully connected to database");
});

module.exports = connectdb;