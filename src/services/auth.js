import axiosInstance from '../axios';
import { jwtDecode } from 'jwt-decode';

export const login = async (credentials) => {
  try {
    const result = await axiosInstance.post('/api/login', credentials); 
    console.log("response result", result);

    if (result && result.token) {
      const decodedToken = jwtDecode(result.token);
      localStorage.setItem('token', result.token);
      localStorage.setItem('role', decodedToken.role);
      console.log("decoded token", decodedToken);
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};
