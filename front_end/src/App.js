import React from 'react';
import './CSS/App.css'

export class LoginPage extends React.Component {

  constructor(props){
    super(props);//
    //check if username is already in cookies then redirect if it is
    try{
      let nameFromCookie = decodeURIComponent(document.cookie);
      console.log("NAME FROM COOKIE: " + document.cookie);
      nameFromCookie = nameFromCookie.split("=");
      console.log("NAME FROM COOKIE: " + nameFromCookie);
      nameFromCookie = nameFromCookie[1];
      console.log("NAME FROM COOKIE: " + nameFromCookie);
      if(nameFromCookie){
        //redirect to main page
        document.location.href = "http://localhost:3000/main";
      }
    }catch(err){
      console.log("error from getting cookie: " + err)
    }

    
  }

  state = {
    users: []
  }

  //once rendered app it gets users and prints to screen
  componentDidMount(err,info){
    this.getUsers();
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
          document.location.href = "http://localhost:3000/main";
        }
      })

  }

  //function to get users
  getUsers = () =>{
    fetch('http://localhost:4000/users')
    .then(response =>response.json())
    .then((data) =>{
      //console.log(data);
      this.setState({users: data.data});
    })
    .catch(err =>{
      console.log(err);
    })
  }

  

//function to add users -- Working
addUser = () =>{
  //doesnt make a difference this
  let user = document.getElementById("username").value;
  let password = document.getElementById('password').value;
  fetch(`http://localhost:4000/users/verifylogin?user=${user}&pass=${password}`)
  .then(res => res.json())
  .then((data) => { 
    console.log(data); 
    if(data == "false"){
      fetch(`http://localhost:4000/users/add?user=${user}&pass=${password}`)
      .then(response => response.json())
      .then(this.getUsers)
      .catch(err =>{
        console.log(err);
      });
      console.log(user +' was added')
    }
    else{
      console.log('already an account')
    }
  })
}

//goes through state which stores database and appends the divs to the app render

  render(){
    const {users} = this.state;
    console.log(users)
    return (
      <div className="App">
        <div className="LoginDiv">
          <h3>Login</h3>
          <div className='LoginInputsDiv'>
            <input id="username" type="text" placeholder="username" ></input>
            <input id="password" type="text" placeholder="password" ></input>
            <button onClick={this.Login}>Login</button>
            <button onClick={this.addUser}>Sign up</button>
          </div>
        </div>
      </div>
    );
  }
}






//for rendering names in divs from database that is stored in the state
  //renderUsers = ({username, password, UID}) => <div key={UID}>{username}</div>;
  //{users.map(this.renderUsers)}