const mysql = require("mysql");

const connectdb = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'schools'
});

connectdb.connect((err)=>{
    if(err)
    {
        console.log("error in connecting")
    }
   
});

module.exports = connectdb;