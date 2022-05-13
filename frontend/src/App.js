
import './App.css';
import React, {useState} from 'react';
import { BrowserRouter, Route, } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingCar from './pages/BookingCar';
import CarList from './pages/CarList';
import Profile from './pages/Profile';
import OwnerProfile from './pages/OwnerProfile';
import {AuthProvider} from './components/authContext';
import Members from './pages/Members';



function App() {

  return (
    <AuthProvider>
      <div className="App"> 
        <BrowserRouter>
          <Route path='/' exact component = {Home}/>
          <Route path='/login' exact component = {Login}/>
          <Route path='/register' exact component = {Register}/>
          <Route path='/bookingcar'  exact component = {BookingCar}/>
          <Route path='/carlist'  exact component = {CarList}/>
          <Route path='/profile'  exact component = {Profile}/>
          <Route path='/ownerProfile'  exact component = {OwnerProfile}/>
          <Route path='/members' exact component= {Members} />
          
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
