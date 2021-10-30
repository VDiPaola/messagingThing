import React from 'react';
import './CSS/App.css'
const hostname = window.location.hostname;



export class LoginPage extends React.Component {

  constructor(props){
    super(props);//
    //check if username is already in cookies then redirect if it is
    try{
      let nameFromCookie = decodeURIComponent(document.cookie);
      nameFromCookie = nameFromCookie.split("=");
      nameFromCookie = nameFromCookie[1];
      console.log("NAME FROM COOKIE: " + nameFromCookie);
      if(nameFromCookie){
        //redirect to main page
        document.location.href = `http://${hostname}:3000/main`;
      }
    }catch(err){
      console.log("error from getting cookie: " + err)
    }
    
    
  }

  state = {
    users: []
  }


  //Login
  Login = () => {
    var username_ = document.getElementById('username').value;
    var password_ = document.getElementById('password').value;
    //find username from database and see if it matches then login if password also matches
    fetch(`http://localhost:4000/users/verifylogin?user=${username_}&pass=${password_}`)
      .then(response => response.json())
      .then((data)=>{
        console.log(data)
        if(data == true){
          //if login successful add username to cookie
          console.log("saving to cookie");
          document.cookie = `username=${username_};`; 
          document.location.href = `http://${hostname}:3000/main`;
        }else{
            //displays error
            let error = document.getElementsByClassName("wrongPassword")[0]
            error.innerHTML = "error with user or pass (case sensitive)";
            error.style.display = "block";
        }
      })

  }

  //function to get users
  getUsers = (user) =>{
    fetch('http://localhost:4000/users')
    .then(response =>response.json())
    .then((data) =>{
      //console.log(data);
      this.setState({users: data.data});
      console.log(user +' was added')
      //redirects to main page
      document.cookie = `username=${user};`; 
      document.location.href = `http://${hostname}:3000/main`;
    })
    .catch(err =>{
      console.log(err);
    })
  }

  

//function to add users -- Working
addUser = () =>{
  //doesnt make a difference this
  let user = document.getElementById("username").value.trim();
  if(user[user.length-1] != ";" && user[0] != ";"){
    let password = document.getElementById('password').value;
    fetch(`http://localhost:4000/users/verifylogin?user=${user}&pass=${password}`)
    .then(res => res.json())
    .then((data) => { 
      console.log(data); 
      if(data == false){
        fetch(`http://localhost:4000/users/add?user=${user}&pass=${password}`)
        .then(response => response.json())
        .then(this.getUsers(user))
        .catch(err =>{
          console.log(err);
        });
      }
      else{
        console.log('already an account')
        //displays error
        let error = document.getElementsByClassName("wrongPassword")[0]
        error.innerHTML = "That user already exists";
        error.style.display = "block";
      }
    })
  }else{
    alert("NO SEMI COLONS AT START OR END");
  }
}

//goes through state which stores database and appends the divs to the app render

  render(){
    const {users} = this.state;
    //console.log(users)
    return (
      <div className="App">
        <p className="wrongPassword"></p>
        <div className="LoginDiv">
          <h3>Login</h3>
          <div className='LoginInputsDiv'>
            <input id="username" type="text" placeholder="username" ></input>
            <input id="password" type="text" placeholder="password" ></input>
            <button onTouchStart={this.Login} onClick={this.Login}>Login</button>
            <button onClick={this.addUser}>Sign up</button>
          </div>
          <h1>Jorzo</h1>
        </div>
      </div>
    );
  }
}






//for rendering names in divs from database that is stored in the state
  //renderUsers = ({username, password, UID}) => <div key={UID}>{username}</div>;
  //{users.map(this.renderUsers)}