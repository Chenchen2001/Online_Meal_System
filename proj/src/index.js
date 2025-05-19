import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
const BASE_URL = "http://localhost:5000/"
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App baseUrl={BASE_URL}/>
    </BrowserRouter>
  </React.StrictMode>
);

