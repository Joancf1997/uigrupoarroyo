import axios from 'axios';

var token = (JSON.parse(window.localStorage.getItem('userAuth'))) ? JSON.parse(window.localStorage.getItem('userAuth')).token : null
var _id = (JSON.parse(window.localStorage.getItem('userAuth'))) ? JSON.parse(window.localStorage.getItem('userAuth'))._id : null
var nombre = (JSON.parse(window.localStorage.getItem('userAuth'))) ? JSON.parse(window.localStorage.getItem('userAuth')).nombre : null


const api = axios.create({
  baseURL: `${process.env.VUE_APP_URL}`,
  headers: {
    Authorization: token,
    id: _id,
    nombre: nombre
  }
})

api.interceptors.request.use(
  async (config) => {
    const session = JSON.parse(window.localStorage.getItem('userAuth'));

    if (session?.token) {
      config.headers = {
        ...config.headers,
        Authorization: JSON.parse(window.localStorage.getItem('userAuth')).token,
        id: JSON.parse(window.localStorage.getItem('userAuth'))._id,
        nombre: JSON.parse(window.localStorage.getItem('userAuth')).nombre
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api