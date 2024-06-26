import axios from 'axios';
import { getSecureLocalStorageItem } from '../services/authUntils';
import useStore from '../store/useStore';

const onHandlleErroerServer=useStore.getState().onHandlleErroerServer
// const baseURL = import.meta.env.VITE_BASE_URL;
const baseURL = "https://e-emplois-server.onrender.com";
const token = getSecureLocalStorageItem('_data_user_') || null;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}` 
  }
});

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.url);
    return response;
  },
  (error) => {
    // const navigate = useNavigate();
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if ( error.response.data.message === 'Invalid authentication token' ||  error.response.data.message === 'Missing authentication token') {
             window.location.href="/"
          } else {
            console.error('Autre erreur 401:', error.response.data.message || error.response.data);
          }
          break;
        case 404:
          console.error('API endpoint non trouvé!');
          break;
        case 500:
            onHandlleErroerServer(error.response.data.message)
          break;
        default:
          console.error('Erreur:', error.response.data);
      }
    } else if (error.request) {
      console.error('Erreur réseau:', error.request);
    } else {
      console.error('Autre erreur:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
