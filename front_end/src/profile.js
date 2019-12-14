import React from 'react';
import './CSS/profile.css';

export class Profile extends React.Component{
    constructor(){
        super();
        this.state = {

        }

        // this.InitialiseUser();
    }

    // InitialiseUser(){
    //     //gets current user(from cookie) and loads profile info into table
    //     if(decodeURIComponent(document.cookie).search("username")){
    //       let nameFromCookie = decodeURIComponent(document.cookie);
    //       nameFromCookie = nameFromCookie.split("=");
    //       let username = nameFromCookie[1];
    //       fetch(`http://localhost:4000/users/profile?user=${username}`)
    //       .then(response => response.json())
    //       .then((data)=>{
    //         if(data == 'true'){
    //           console.log('loggedin')
    //           this.state.profile = data;
    //         }else{
    //           console.log('failed')
    //         }
    //       })
    //     }else{
    //       //no recoreded user so redirect to login page
    //       document.location.href = "http://localhost:3000/";
    //     }

    // }

    render(){
        return(
            <div>

            </div>
        )
    }
}


