import axios from 'axios';
import { httpsAgent } from './agent.js';

export const createHttpClient = ({ baseURL }) => {
  return axios.create({
    baseURL,
    timeout: 15000,
    httpsAgent,
  });
};
