import axios from 'axios';

const axioshelper = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default axioshelper;
