const mysql = require('mysql');

const connectDB = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost' ,
    user: process.env.DB_USER || 'root',
    password:process.env.DB_PASSWORD || '',
    database:process.env.DB_NAME || 'test'
});

connectDB.connect((err)=>{
    if(err){
        console.log("error in connection")
    }else{
        console.log("database connected sucessfully")
    }
})

module.exports = connectDB;