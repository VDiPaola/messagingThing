import React from 'react';
import './CSS/MainPage.css';
import $ from 'jquery';

export class MainPage extends React.Component{

    constructor(props){
        super(props);
        this.InitialiseUser();
        this.searchForUser.bind(this);
    }

    InitialiseUser(){
        //gets current user(from cookie) and loads profile info into table
        console.log(decodeURIComponent(document.cookie))
        if(decodeURIComponent(document.cookie).search("username")){
          let nameFromCookie = decodeURIComponent(document.cookie);
          nameFromCookie = nameFromCookie.split("=");
          let username = nameFromCookie[1];
          fetch(`http://localhost:4000/users/profile?user=${username}`)
          .then(response => response.json())
          .then((data)=>{
            if(data == 'true'){
              console.log('loggedin')
              this.state.profile = data;
            }else{
              console.log('failed')
            }
          })
        }else{
          //no recoreded user so redirect to login page
          document.location.href = "http://localhost:3000/";
        }

    }

    // WORKS
    searchForUser(e){
      //when search bar input changes we search for names
      let username = e.target.value;
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
                dropdowndiv.innerHTML += '<div id="searchresult" > <p class="nameEvent">'+data[i].username+' </p><div id="searchresultsbutton"><button>Message</button><button>Add Friend</button></div> </div>'
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


    render(){
        return(
            <div className="MainPageWrapper">
              <div className="profilediv" id='profilediv'>
                <p id="closeProfile" onClick={this.closeprofilediv}>X</p>
                <h3 id='profiledivuser'></h3>
                <p id='profiledivbio'>No Bio</p>
              </div>
                <div className="SidebarDiv">
                  <div className="OpenChatsDiv">
                  </div>
                </div>
                <div className="SearchbarDiv">
                  <input id='SearchBarInput' onChange={this.searchForUser} placeholder="Search For A User"/>
                </div>
                <div className="SearchResultsDiv" id="SearchResultsDiv">
                </div>
            </div>

        )
    }
}
