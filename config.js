const mysql = require('mysql');

const connectDB = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'test'
});

connectDB.connect((err)=>{
    if(err){
        console.log("error in connection")
    }else{
        console.log("database connected sucessfully")
    }
})

module.exports = connectDB;