import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const tokenData = await login(username, password);
      localStorage.setItem('access_token', tokenData.access);
      localStorage.setItem('refresh_token', tokenData.refresh);
      navigate('/tasks');
    } catch (error) {
      setError('Ошибка авторизации. Проверьте свои учетные данные.');
    }
  };

  return (
    <div className="outer-container">
      <div className="form-container">
        <h1 className="title">Вход</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="form">
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="button">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
