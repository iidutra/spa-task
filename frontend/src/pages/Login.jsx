import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import '../styles/Style.css';
import '../styles/Login.css';


function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setCredentials({
      ...credentials,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isRegistering) {
      try {
        const response = await register(credentials);
        if (response.status === 201) {
          alert('Usuário criado com sucesso!');
          setIsRegistering(false);
        } else {
          alert('Algo deu errado. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data.message || 'Falha no registro');
      }
    } else {
      try {
        const response = await login(credentials);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          navigate('/Home');
        } else {
          alert('Algo deu errado. Por favor, tente novamente.');
        }
      } catch (error) {
        console.error(error);
        alert(error.response?.data.message || 'Falha no login');
      }
    }
  };

  return (
    <div className="body-card-bg">

      <div className="flex-row">
        <div className="flex-column">
          <div className="card login-container">
            {isRegistering ? (
              <h2>Criar um usuário</h2>
            ) : (
              <h2>Login</h2>
            )}
            <form onSubmit={handleSubmit}>
              <label>
                Usuário
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                />
              </label>
              <label>
                Senha
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </label>
              <button className="button-secondary" type="submit">{isRegistering ? 'Registrar' : 'Entrar'}</button>
              {!isRegistering && (
                <button type="button" onClick={() => setIsRegistering(true)}>Criar um usuário</button>
              )}
            </form>
            {isRegistering && (
              <button className="back-button" type="button" onClick={() => setIsRegistering(false)}>Voltar ao login</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
