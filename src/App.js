import React from 'react';
import './App.scss';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import HomePage from './HomePage/HomePage';
import AboutPage from './AboutPage/AboutPage';
import LoginPage from './LoginPage/LoginPage';
import Menu from './Menu/Menu';
import Hero from './Hero/Hero';
import BudgetChart  from './Chart/Chart';
import D3pieChart from './D3Chart/D3Chart';
import Axios from './Axios/Axios';
import Footer from './Footer/Footer';


function App() {
  return (
    <Router>
      <Menu />
      <Hero />
      <div className='mainContainer'>
        <Switch>
          <Route path="/about">
            <AboutPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/chart">
            <BudgetChart  />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
          <Route path="/d3chart">
            <D3pieChart />
          </Route>
          <Route path="/axios">
            <Axios />
          </Route>
        </Switch>
      </div>
      <Footer />

    </Router>
  );
}

export default App;
