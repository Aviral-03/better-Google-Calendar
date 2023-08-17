import Home from './components/Home'
import LandingPage from './components/LandingPage/LandingPage'
import { useSelector } from 'react-redux';
import React from 'react';
import './style/App.css'

function App() {
  const isAuthenticated = useSelector((state) => state.auth.authenticated)
  console.log("App.js");
  // console.log(isAuthenticated);
  return (
    <div className="App">
      {isAuthenticated ? <Home /> : <LandingPage />}
    </div>
  );
}

export default App;
