import React from 'react';
import './CSS/MainPage.css';
import $ from 'jquery';

export class MainPage extends React.Component{

    constructor(props){
        super(props);

        this.state = {
          profile: ""
        }

        this.InitialiseUser.bind(this);
        this.InitialiseUser();
        this.searchForUser.bind(this);

        document.body.addEventListener("keydown",(e)=>{
          if(e.keyCode == 13){
            //enter key pressed
            this.getMessages();
            this.sendMessage();
          }
        })
    }
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
              if(this.state.profile.bio != ''){
                text.innerHTML = this.state.profile.bio;
              }else{
                text.innerHTML = "No Bio"
              }
            }else{
              console.log('failed')
              document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
              document.location.href = "http://localhost:3000/";
            }
          })
        }else{
          //no recoreded user so redirect to login page
          console.log("main no cookie")
          document.location.href = "http://localhost:3000/";
        }

    }

    // WORKS
    searchForUser(e){
      //when search bar input changes we search for names
      let username = e.target.value;
      let usernameForEvents = this.state.profile.username;
      let dropdowndiv = document.getElementById("SearchResultsDiv");
      if(username == ""){
        dropdowndiv.innerHTML = '';
        dropdowndiv.style.display = 'none';
        return false;
      }
          fetch(`http://localhost:4000/users/search?user=${username}`)
          .then(response => response.json())
          .then((data)=>{
            //if data is not empty, add the names to the html
            if(data[0]){
              console.log(data);
              //add first 5 names to the dropdown
              dropdowndiv.innerHTML = ''
              dropdowndiv.style.display = 'inline-block';
              for(let i=0;i<data.length && i < 5;i++){
                dropdowndiv.innerHTML += '<div className="searchresultstext"> <p id="searchresult" class="nameEvent">'+data[i].username+' </p><p> Bio: '+data[i].bio+'</p><div id="searchresultsbutton"><button>Message</button><button class="friendEvent">Add Friend</button></div> </div>'
              }


              for(let i =0; i<document.getElementsByClassName("friendEvent").length;i++){
                document.getElementsByClassName("friendEvent")[i].addEventListener("click", function(e){
                  //CLICKED ADD FRIEND
                  let friendname = e.target.parentNode.parentNode.childNodes[1].innerHTML;
                  
                  fetch(`http://localhost:4000/users/addfriend?friendname=${friendname}&username=${usernameForEvents}`)
                    .then(response => response.json())
                    .then((data) => {
                      console.log(data)
                    })
                  
                });
              }
              for(let i =0; i<document.getElementsByClassName("nameEvent").length;i++){
                document.getElementsByClassName("nameEvent")[i].addEventListener("click",function(e){
                  //gets profile from specified user
                  let username = e.target.innerHTML;
                  fetch(`http://localhost:4000/users/profile?user=${username}`)
                      .then(response => response.json())
                      .then((data)=>{
                        if(data.data[0].username){
                          //user found
                          console.log("found user: " + data.data[0].username + data.data[0].bio);
                          //change profile div to display this info
                          let profileDiv = document.getElementById("profilediv");
                          let profileName = document.getElementById("profiledivuser");
                          let profileBio = document.getElementById("profiledivbio");
                          profileName.innerHTML = data.data[0].username;
                          if(data.data[0].bio == ''){
                            profileBio.innerHTML = 'No Bio';
                          }else{
                            profileBio.innerHTML = data.data[0].bio;
                          }
                          //displays div
                          profileDiv.style.display = 'block'
                        }else{
                          //user not found
                          console.log("error, couldnt fetch user")
                        }
                      })
                })
              }

            }
          })
    }

    closeprofilediv(){
      document.getElementById('profilediv').style.display='none';
    }

    signOut(){
      //deletes cookie and goes back to login page
      document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
      window.location.href = "http://localhost:3000/";
    }

    getMessages(){
      fetch(`http://localhost:4000/users/getmessages?username=${this.state.profile.username}`)
      .then(response => response.json())
      .then((data)=> {
        console.log(data)
      })
    }

    sendMessage(){
      let sendto = 'enzo'
      let message = document.getElementById('MessageInput').value;
      let object = sendto+`:{message:"${message}"}`
      console.log(object)

      fetch(`http://localhost:4000/users/sendmessage?sendto=${sendto}&username=${this.state.profile.username}&message=${object}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data.data.messages)
      })

    }//



    render(){
        return(
            <div className="MainPageWrapper">
              <div className="profilediv" id='profilediv'>
                <p id="closeProfile" onClick={this.closeprofilediv}>X</p>
                <h3 id='profiledivuser'></h3>
                <p id='profiledivbio'>No Bio</p>
              </div>
              <div className="profileDropdown">
              </div>
                <div className="SidebarDiv">
                <button id='SettingsDropDown'>···</button>
                <div className="SidebarProfileDiv">
                    <h3>Profile:</h3>
                    <h4 id='Sidebarusername' onClick={function(){window.location.href = "http://localhost:3000/profile"}}>{this.state.profile.username}</h4>
                    <p id='Sidebarbio'>{this.state.profile.bio}</p>
                  </div>
                  <div className="OpenChatsDiv">
                    <h3>Chats:</h3>
                  </div>
                  <button onClick={this.signOut}>LOGOUT</button>
                </div>
                <div className="SearchbarDiv">
                  <input id='SearchBarInput' onChange={this.searchForUser.bind(this)} placeholder="Search For A User"/>
                </div>
                <div className="SearchResultsDiv" id="SearchResultsDiv">
                </div>

                <div className="MessagesContainer">
                  <div id='ShowMessages'>
                  </div>
                  <input id = 'MessageInput' placeholder="Send a message..."/>
                </div>
                
            </div>

        )
    }
}
