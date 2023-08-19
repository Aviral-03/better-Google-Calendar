import Home from '../src/components/CalendarLayout/Home'
import LandingPage from './components/LandingPage/LandingPage'
import { useSelector } from 'react-redux';
import React from 'react';
import './style/App.css'

function App() {
  const isAuthenticated = useSelector((state) => state.auth.authenticated)
  return (
    <div className="App">
      {isAuthenticated ? <Home /> : <LandingPage />}
    </div>
  );
}

export default App;
