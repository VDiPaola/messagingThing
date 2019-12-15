import React from 'react';
import './CSS/profile.css';

export class Profile extends React.Component{
    constructor(props){
        super(props);
        this.InitialiseUser();
        this.state = {
            profile : ''
        }

        this.changeBio.bind(this)
    }

    // -------  ???????  ----------
    InitialiseUser(){
        //gets current user(from cookie) and loads profile info into table
        
        let nameFromCookie = decodeURIComponent(document.cookie);
        nameFromCookie = nameFromCookie.split("=");
        let username = nameFromCookie[1];
        if(username != "" || username != undefined){ 
        console.log("name in cookie: "+username);
        fetch(`http://localhost:4000/users/profile?user=${username}`)
        .then(response => response.json())
        .then((data)=>{
          console.log(data);
          if(data.data[0]){
            console.log('loggedin')
            this.setState({profile: data.data[0]});
            console.log(this.state.profile)
            let text = document.getElementById('Sidebarbio');
          }else{
            console.log('failed')
            document.location.href = "http://localhost:3000/";
          }
        })
      }else{
        //no recoreded user so redirect to login page
        console.log("main no cookie")
        document.location.href = "http://localhost:3000/";
      }
    }

    //  ------  WORKS  ------
    changeBio(){
        let newbio = document.getElementById('bioinput').value; 
        let username = this.state.profile.username
        fetch(`http://localhost:4000/users/setbio?bio=${newbio}&user=${username}`)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            document.getElementById('ProfileBio').innerHTML = data.data
        })
    }

    changeUsername(){
        let newusername = document.getElementById('usernameinput').value.trim();
        //if username isnt blank or has a semi colon on start/end
        if(newusername != "" && newusername[newusername.length-1] != ";" && newusername[0] != ";"){

          let username = this.state.profile.username;
          fetch(`http://localhost:4000/users/changeusername?user=${newusername}&username=${username}`)
          .then(response => response.json())
          .then((data) => {
              console.log(data)
              //updates screen, state and cookie
              document.getElementById('ProfileUsername').innerHTML = data.data
              this.state.profile.username = data.data;
              document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
              document.cookie = `username=${data.data};`;  
          })
        }else{
          alert("Invalid Name");
        }
    }

    deleteAccount(){
      //ask if they are sure
      let choice = prompt("If you are sure you want to PERMANANTLY DELETE your account FOREVER enter '" + this.state.profile.username + "' then press 'ok'");
      if(choice == this.state.profile.username){
        //delete account
        fetch(`http://localhost:4000/users/deleteAccount?username=${this.state.profile.username}`)
        .then((data)=>{
          //clear cookie
          document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
          //redirect to login
          document.location.href = "http://localhost:3000/";
        })
        .catch(err =>{console.log(err)})

        
      }

    }

    render(){
        return(
            <div className="profileContainer">
                <div className="profileBackButton"><p onClick={function(){document.location.href = "http://localhost:3000/main";}}>Jorzo</p></div>
                <h2 id='ProfileUsername'>{this.state.profile.username}</h2>
                <h3>Bio: </h3>
                <h4 id='ProfileBio'>{this.state.profile.bio}</h4>

                <div className="changeUsernameDiv">
                <input id='usernameinput' placeholder='New Username'/>
                <button onClick={this.changeUsername.bind(this)}>Change Username</button>
                </div>

                <div className="changeBioDiv">
                <input id='bioinput' placeholder='New Bio'/>
                <button onClick={this.changeBio.bind(this)}>Change Bio</button>
                </div>
                <div className="profileFriendsDiv">
                  WHERE FRIENDS WILL BE ADDED
                </div>
                <div className="profileDeleteAccount" onClick={this.deleteAccount.bind(this)}><p>Delete Account</p></div>

            </div>
        )
    }
}


