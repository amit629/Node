var mysql=require('mysql')

/* var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"Employee_System"
}) */
/* var con= () =>{
    return mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"Employee_System"
    })
} */

var con=mysql.createPool({
    connectionLimit:1000,
    host:"localhost",
    user:"root",
    password:"",
    database:"Employee_System"
});
module.exports=con