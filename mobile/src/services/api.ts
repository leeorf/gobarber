import axios from 'axios';

export const apiIOS = axios.create({
  baseURL: 'http://localhost:3333',
});

export const apiAndroid = axios.create({
  baseURL: 'http://10.0.2.2:3333/',
});
