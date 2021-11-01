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
                return res.json({data : "rightuser"});
                
            }
            return res.send('false'); 
        }

    })
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
    const INSERT_USER = `INSERT INTO userpass(username, password,bio,friends,messages) VALUES('${user}', '${pass}', '', '','"example":{"message":[""]}')`;

    connection.query(INSERT_USER, (err, results)=>{
        if(!err){
            return res.json({ data : 'added user' });
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


//set bio

app.get('/users/setbio', (req,res) => {
    const {bio, user} = req.query;
    const CHANGE_BIO = `UPDATE userpass SET bio = '${bio}' WHERE username = '${user}'`

    connection.query(CHANGE_BIO, (err, results) => {
        if(err){return console.log(err)}
        //return res.send(bio)
        return res.json({
            data: bio
        });
    })
})

//change username
app.get('/users/changeusername', (req,res) => {
    const {user,username} = req.query;
    const CHANGE_USERNAME = `UPDATE userpass SET username = '${user}' WHERE username = '${username}'`
    const FIND_USER = `SELECT username FROM userpass WHERE username='${user}'`;
    console.log("changingUser; user:  " + user + " username: " + username);
    //find if user exists
    connection.query(FIND_USER, (err,results) => {
        if(err){return console.log(err)}
        console.log(results)
        if(results[0] != undefined){
            //name already exists return false
            console.log("cant change username: already exists")
            return res.json({ data: username });
        }else{
            //name doesnt exists update their name
            return connection.query(CHANGE_USERNAME, (err,results) => {
                if(err){return console.log(err)}
                console.log("changing username")
                return res.json({ data: user });
            })
        }
    })

    
})

//Add friend
app.get('/users/addfriend', (req,res) => {
    const {friendname, username} = req.query;
    console.log("friendsname: " + friendname + " username: " + username);
    const ADD_FRIEND = `UPDATE userpass SET friends = CONCAT(friends, ';${friendname.trim()}') WHERE username='${username}'`

    //query to get all friends
    const GET_FRIENDS = `SELECT friends FROM userpass WHERE username="${username}"`;
    connection.query(GET_FRIENDS, (err, results) => {
        if(err){return console.log(err)}else{
            //gets array of all names
            let friendsArr = results[0].friends.split(";");
            for(let i =0;i<friendsArr.length;i++){
                if(friendsArr[i] == friendname.trim()){
                    //if friend matches name they want to add return false
                    console.log("MATCH")
                    return res.send('false');
                }
            }
            //doesnt match in loop so it adds friend to database
            return connection.query(ADD_FRIEND, (err, results) => {
                if(err){return console.log(err)}
                return res.json({ data : results})
            })
        }
        
    })

})


//send message
app.get('/users/sendmessage',(req,res) => {
    const { sendto, username, message } = req.query;
    let object = `,"${sendto}": {"message": ["${username}℗${message}"]}`
    let object2 = `,"${username}": {"message": ["${username}℗${message}"]}`
    let SEND_MESSAGE = `UPDATE userpass SET messages = CONCAT(messages, '${object2}') WHERE username = '${sendto}'`
    let SAVE_MESSAGE = `UPDATE userpass SET messages = CONCAT(messages, '${object}') WHERE username = '${username}'`
    const selectall = `SELECT messages FROM userpass WHERE username = '${username}'`

    connection.query(selectall,(err,result)=>{
        console.log(result) //
        console.log(username) 
        let StringObject = result[0].messages;
        let MessagesObject = false;
        try{
            console.log("1")
            MessagesObject = JSON.parse( "{" + StringObject + "}"); //i see
            
        }catch(err){
            console.log("2")
            MessagesObject = JSON.parse(StringObject);
        }
        
        //console.log(Object.keys(MessagesObject))
        if(Object.keys(MessagesObject).indexOf(sendto) > -1){

            //if their name is already in the object append the message
            //format name℗message
            //the message
            let newObject = `${username}℗${message}`
            //message change for current user
            MessagesObject[sendto].message[MessagesObject[sendto].message.length] = newObject;

            
            let finalSave = JSON.stringify(MessagesObject);
            finalSave = finalSave.substr(1);
            finalSave = finalSave.substr(0,finalSave.length-1)
            
            SAVE_MESSAGE = `UPDATE userpass SET messages= '${finalSave}' WHERE username = '${username}'`

            const GET_FRIEND = `SELECT messages FROM userpass WHERE username = '${sendto}'`;

            connection.query(GET_FRIEND, (err,result)=>{
                if(err){return console.log(err)}
                let StringObject2 = result[0].messages;
                let MessagesObject2 = false;
                try{
                    console.log("1")
                    MessagesObject2 = JSON.parse( "{" + StringObject2 + "}"); //i see
                    
                }catch(err){
                    console.log("2")
                    MessagesObject2 = JSON.parse(StringObject2);
                }
                MessagesObject2[username].message[MessagesObject2[username].message.length] = newObject;
                let finalSend = JSON.stringify(MessagesObject2);
                finalSend = finalSend.substr(1);
                finalSend = finalSend.substr(0,finalSend.length-1)
                SEND_MESSAGE = `UPDATE userpass SET messages= '${finalSend}' WHERE username = '${sendto}'`
                connection.query(SEND_MESSAGE, (err,result) => {
                    if(err){return console.log(err)}
                    connection.query(SAVE_MESSAGE, (err, results)=> {
                        if(err){return console.log(err)}
                        return res.json({ data : 'Success' }) 
                    })
                })
            })

            
        }else{
            //runs once for each user
            connection.query(SEND_MESSAGE, (err,result) => {
                if(err){return console.log(err)}
                connection.query(SAVE_MESSAGE, (err, results)=> {
                    if(err){return console.log(err)}
                    return res.json({ data : 'Success' }) 
                })
            })
        }

        


    })


})



//get messages
app.get('/users/getmessages',(req,res) => {
    const { username,  to } = req.query;
    const GET_MESSAGES = `SELECT messages FROM userpass WHERE username = '${username}'`
    connection.query(GET_MESSAGES,(err,result) => {
        if(err){return console.log(err)}
        console.log(username + "  " + to) //e
        if(result[0] != undefined){

            let StringObject = result[0].messages;
            let MessagesObject = false;
            try{
                console.log("1")
                MessagesObject = JSON.parse( "{" + StringObject + "}");
                
            }catch(err){
                console.log("2")
                MessagesObject = JSON.parse(StringObject);
            }
            console.log(result[0].messages)
            if(MessagesObject[to]){
                res.json({data : MessagesObject[to]})
            }else{
                res.json({data : "false"})
        
            }
         }
    })
})// 

//delete account
app.get('/users/deleteAccount',(req,res) => {
    const { username } = req.query;
    const DELETE_ACCOUNT = `DELETE FROM userpass WHERE username='${username}'`
    console.log("Deleting: " + username)
    connection.query(DELETE_ACCOUNT,(err,result) => {
        if(err){return console.log(err)}
        console.log("Deleting2: " + username)
        return res.json({data : result})
    })
})

app.listen(4000, ()=>{
    console.log('listening');
})
//no res

