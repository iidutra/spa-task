import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  timeout: 10000,
});

// Correctly set up the interceptor on the api instance, not the global axios instance
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});



export const request = async (path) => {
  const result = await api.get(path); // Use the custom api instance with the interceptor
  return result.data; // Assumes the server returns JSON data
};

export const post = async (endpoint, body) => {
  try {
    const { data } = await api.post(endpoint, body);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const update = async (endpoint, task) => {
  try {
    const { data } = await api.put(endpoint, task);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTask = async (endpoint) => {
  try {
    const { data } = await api.delete(endpoint);
    return data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      alert(`Erro no login: ${error.response.data.message}`);
    } else if (error.request) {
      console.log(error.request);
      alert('Erro no login: Sem resposta do servidor');
    } else {
      console.log('Erro:', error.message);
      alert('Erro no login: Problema na requisição');
    }
  }
};

export const createTag = async (tagName) => {
  try {
    const { data } = await api.post('/tags', { name: tagName });
    return data;
  } catch (error) {
    const errorMessage = error.response ? error.response.data.message : error.message;
    console.error('Erro:', errorMessage);
    // Pode ser necessário ajustar o que é mostrado dependendo da estrutura de sua resposta de erro.
    alert(`Erro: ${errorMessage}`);
    throw error; // Somente se você quiser que o erro seja tratado também na chamada dessa função.
  }
};

export const updateTag = async (endpoint, body) => {
  try {
    const { data } = await api.put(endpoint, body);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar a tag:', error);
    throw error;
  }
};

export const deleteTag = async (endpoint) => {
  try {
    const { data } = await api.delete(endpoint);
    return data;
  } catch (error) {
    console.error('Erro ao deletar a tag:', error);
    throw error;
  }
};


export const login = async (credentials) => {
  return api.post('/auth/login', credentials);
};

export const register = async (credentials) => {
  return api.post('/users/register', credentials)
}

export default api;