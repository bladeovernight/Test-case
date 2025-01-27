import axios from 'axios';

// Создаём экземпляр axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', 
  headers: {
    'Content-Type': 'application/json', 
  },
});

// Interceptor для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    console.error('Ошибка при добавлении токена в заголовки:', error);
    return Promise.reject(error); 
  }
);

// Interceptor для обработки ошибок ответов
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    
    if (error.response && error.response.status === 401) {
      console.warn('Токен истёк или недействителен. Необходима повторная авторизация.');
     
      localStorage.removeItem('access_token');
      
    }
    return Promise.reject(error); 
  }
);

// Функция для авторизации через API
export const login = async (username, password) => {
  try {
    const response = await api.post('/token/', {
      username,
      password,
    });
    // Сохраняем токены в localStorage
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return response.data;
  } catch (error) {
    console.error('Ошибка авторизации:', error.response?.data || error.message);
    throw error; 
  }
};

// Функция для обновления токена
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('Токен обновления отсутствует');
    const response = await api.post('/token/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('access_token', access); 
    return access;
  } catch (error) {
    console.error('Ошибка обновления токена:', error.response?.data || error.message);
    throw error;
  }
};


export default api;
