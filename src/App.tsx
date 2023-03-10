import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppLayout from './pages/Layout';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">

        <AppLayout />
    </div>
  );
}

export default App;
