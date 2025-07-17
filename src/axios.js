import axios from 'axios';
import _ from 'lodash';
import config from './config';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || config.api.API_BASE_URL,
  withCredentials: true,
});

const createError = (
  httpStatusCode,
  statusCode,
  errorMessage,
  problems,
  errorCode = ''
) => {
  const error = new Error();
  error.httpStatusCode = httpStatusCode;
  error.statusCode = statusCode;
  error.errorMessage = errorMessage;
  error.problems = problems;
  error.errorCode = errorCode + '';
  return error;
};

export const isSuccessStatusCode = (s) => {
  const statusType = typeof s;
  return (
    (statusType === 'number' && (s === 0 || s === 1000 || s === 200)) ||
    (statusType === 'string' && s.toUpperCase() === 'OK')
  );
};

instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (
      data.hasOwnProperty('code') &&
      !isSuccessStatusCode(data['code']) &&
      data.hasOwnProperty('message')
    ) {
      return Promise.reject(
        createError(response.status, data['code'], data['message'])
      );
    }

    if (data?.result) {
      return data.result;
    }

    return data;
  },
  (error) => {
    const { response } = error;
    if (response == null) {
      return Promise.reject(error);
    }

    const { data } = response;
    if (data.hasOwnProperty('code') && data.hasOwnProperty('message')) {
      return Promise.reject(
        createError(
          response.status,
          data['code'],
          data['message'],
          data['problems']
        )
      );
    }
    return Promise.reject(createError(response.status));
  }
);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;