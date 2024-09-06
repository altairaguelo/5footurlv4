//import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Form from "./components/Form";

function App() {
  return (
    <div className="App">
      <div className='auth-wrapper'>
        <div className='auth-inner'>
          <BrowserRouter basename='/app'>
            <Routes>
              <Route exact path='/' element={<Form />} />
              <Route path="/app" element={<Form />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
