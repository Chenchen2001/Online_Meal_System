/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import "./App.css"
import Login from './pages/Login';
import Main from './pages/Main';
import Register from './pages/Register';
// eslint-disable-next-line
import i18n from './react-i18next-config'

export default function App({ baseUrl }){
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const validateToken = () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            axios.get(baseUrl+'protected', {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                })
                .then(()=>setToken(storedToken))
                .catch(()=>localStorage.removeItem('token'))
                .finally(() => setLoading(false)
            )
        }
        setLoading(false);
    };

    useEffect(() => {
        validateToken();
    }, []);

    const handleSetToken = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    return (
        <>
        {
        loading ? <div>Loading...</div> : 
        <Routes>
            <Route path="/" element={<Navigate to={token ? "/main" : "/login"} />} />
            <Route path="/login" element={token ? <Navigate to="/main" /> : <Login setToken={handleSetToken} baseUrl={baseUrl}/>} />
            <Route path="/register" element={token ? <Navigate to="/main" /> : <Register baseUrl={baseUrl}/>} />
            <Route path="/main/*" element={token ? <Main token={token} setToken={handleSetToken} baseUrl={baseUrl}/> : <Navigate to="/login" />} />
        </Routes>
        }
        </>
    );
};