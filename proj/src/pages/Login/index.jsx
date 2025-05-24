import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login-img.png'; 
import { Select } from 'antd'
import { useTranslation } from 'react-i18next';

export default function Login({ setToken, baseUrl }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission reload
        setError(''); // Clear previous errors
        try {
            const response = await axios.post(baseUrl+'login', {
                username,
                password
            });
            setToken(response.data.token);
            navigate('/main');
        } catch (err) {
            setPassword("");
            setError(`Failed to login: ${err.response?.data?.message || JSON.stringify(err)}`);
        }
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
                    backgroundImage: `url(${loginImage})`,
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
                    }}>{t("login.welcomeBack")}</h2>
                    
                    {error && (
                        <div style={{
                            color: 'red',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>{error}</div>
                    )}
                    
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px'
                            }}>{t("login.username")}</label>
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
                                placeholder={t("login.usernamePlaceholder")}
                                required
                            />
                        </div>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px'
                            }}>{t("login.password")}</label>
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
                                placeholder={t("login.passwordPlaceholder")}
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
                            {t('login.loginButton')}
                        </button>
                    </form>
                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        🌐<Select defaultValue={i18n.language} options={[
                            { value: 'zh-CN', label: <span>🇨🇳 简体中文</span> },
                            { value: 'zh-HK', label: <span>🇭🇰 繁體中文</span> },
                            { value: 'en', label: <span>🇬🇧 English</span> }
                            ]} 
                            onChange={(e) => {
                                i18n.changeLanguage(e);
                            }}
                            style={{marginLeft: 10, width: '9em'}}
                        /> <br />
                        {t("login.registerInfo")} <a href="/register" style={{ color: '#4CAF50' }}>{t("login.registerIcon")}</a><br />
                        {t("login.githubIntro")}<a href='https://github.com/Chenchen2001/Online_Meal_System' style={{ color: '#4CAF50' }}>{t("login.github")}</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
