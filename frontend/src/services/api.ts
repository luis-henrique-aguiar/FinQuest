import axios from 'axios';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor: Token anexado à requisição.');
    }
    
    return config;
  },
  (error) => {
    console.error('Erro no interceptor do Axios:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn(
        `Interceptor de Resposta: Recebido ${status} da API. Token inválido ou usuário não autorizado.`
      );

      try {
        await signOut(auth);
        console.log("Interceptor: Logout forçado no Firebase bem-sucedido.");
      } catch (e) {
        console.error("Interceptor: Erro ao tentar forçar o logout.", e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;