const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const selectAllUsers = 'SELECT * FROM userpass';

function get_Connection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'testdatabase'
    })
}

let connection = get_Connection();

app.use(cors());

app.get('/', (req,res)=>{
    res.send("goto /users to see database")
})

app.get('/users', (req,res)=>{
    connection.query(selectAllUsers, (err,results)=>{
        if(!err){
            //SENDS DATABASE
            return res.json({
                data: results
            });
        }else{
            res.send(err);
        }
        connection.end();
    })
})//why does it keep going offline


//verify login ----- half Working  -------
app.get('/users/verifylogin', (req,res) => {
    const {user, pass} = req.query
    const FIND_USER = `SELECT * FROM userpass WHERE username="${user}"`;
    connection.query(FIND_USER,(err,results) => {
        if(err){return console.log(err)}else{
            if(results[0]){
                if(results[0].password == pass){
                    
                    return res.send("true"); 
                }
                return res.send('rightuser');
                
            }
            return res.send('false'); 
        }

    })
})



//get info about a user
app.get('/users/profile', (req,res)=>{
    //sets parameters for query
    const {user} = req.query;
    //creates variable for query
    const GET_USER = `SELECT * FROM userpass WHERE username = "${user}"`;

    connection.query(GET_USER, (err, results)=>{
        if(!err){
            return res.json({
                data: results
            });
        }else{
            return res.send(err);
        }
    })
})

//add users
app.get('/users/add', (req,res)=>{
    //sets parameters for query
    const {user, pass} = req.query;
    //creates variable for query
    const INSERT_USER = `INSERT INTO userpass(username, password) VALUES('${user}', '${pass}')`;

    connection.query(INSERT_USER, (err, results)=>{
        if(!err){
            return res.send('added user');
        }else{
            return console.log(err);
        }
    })
})


//Search For User

app.get('/users/search', (req,res) => {
    const {user} = req.query;
    const SEARCH_USER = `SELECT * FROM userpass WHERE username LIKE '%${user}%'`;
    

    connection.query(SEARCH_USER, (err,results) => {
        if(err){return console.log(err)};
        res.send(results);
    })
})

app.listen(4000, ()=>{
    console.log('listening');
})
//no res