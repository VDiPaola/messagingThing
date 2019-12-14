import { BrowserRouter, Route, Switch } from "react-router-dom";
  import React from 'react';
  import { LoginPage } from './App.js'
  import { MainPage } from './MainPage.js'
  import { Profile } from './profile.js'

export default function Routes(){
      return(
    <BrowserRouter>
    <Switch> 
        <Route path='/' exact component={LoginPage}></Route>
        <Route path='/profile' exact component={Profile}></Route>
        <Route path='/login' exact component={LoginPage}></Route>
        <Route path='/main' exact component={MainPage}></Route>
        <Route path='/' render={() => <div>404</div>}></Route>
    </Switch>
    </BrowserRouter>
    )
  }


