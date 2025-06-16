import axios from 'axios';
const baseURL = 'http://localhost:3000'
const axioshelper = axios.create({
  baseURL: baseURL,
});

export default axioshelper;
