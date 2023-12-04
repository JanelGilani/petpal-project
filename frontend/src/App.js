import './styles/App.css';
import React from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import 'semantic-ui-css/semantic.min.css'
import AppRouter from './AppRouter';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <div className='App'>
      <LandingPage />
      {/* <Login /> */}
      {/* <Register /> */}
      {/* <Navbar /> */}
    </div>
  );
}
