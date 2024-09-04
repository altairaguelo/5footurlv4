import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD8917WRz5V0SJvBm4-CqkwGM5xG4-Kigw",
  authDomain: "footurlv4.firebaseapp.com",
  projectId: "footurlv4",
  storageBucket: "footurlv4.appspot.com",
  messagingSenderId: "736183281274",
  appId: "1:736183281274:web:480f7c1ee4df05b24abdc3",
  measurementId: "G-M70P2G8QXD"
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
