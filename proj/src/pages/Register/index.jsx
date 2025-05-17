import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import registerImage from '../../assets/login-img.png';

export default function Register({ baseUrl }){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        axios.post(baseUrl+'register', {
            username,
            password
        }).then(()=>{
            setMessage('Registration successful! Please login.')
            setTimeout(() => navigate('/login'), 2000);
        }).catch(err=>setMessage(`Registration failed. ${err.response.data.message}.`))
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                display: 'flex',
                width: '800px',
                height: '500px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    flex: 1,
                    backgroundImage: `url(${registerImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} />
                <div style={{
                    flex: 1,
                    padding: '40px',
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <h2 style={{
                        marginBottom: '30px',
                        color: '#333',
                        textAlign: 'center'
                    }}>Create Account</h2>
                    
                    {message && (
                        <div style={{
                            color: message.includes('successful') ? 'green' : 'red',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>{message}</div>
                    )}
                    
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px'
                            }}>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px'
                            }}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                        >
                            Register
                        </button>
                    </form>
                    
                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        Already have an account? <a href="/login" style={{ color: '#4CAF50' }}>Sign in</a>
                    </div>
                </div>
            </div>
        </div>
    );
};