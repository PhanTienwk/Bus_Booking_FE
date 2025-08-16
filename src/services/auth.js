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
    throw new Error(error.message || 'Đăng nhập không thành công!');
  }
};

export const register = async (email) => {
  try {
    const response = await axiosInstance.post('/api/register', { email });
    console.log("Phản hồi đăng ký:", response.data);
    if (response.code === 200) {
      return response; 
    } else {
      throw new Error(response.data.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    throw new Error(error?.errorMessage ||
      error?.response?.data?.message ||
      error?.message || 'Không thể kết nối đến server.');
  }
};
export const verifyOTP = async ({ email, otp }) => {
  try {
    console.log("Email"+email);
    const data = await axiosInstance.post('/api/verify', { email, code: otp });
    console.log("Phản hồi xác thực OTP:", data);
    return data;
  } catch (error) {
    console.error( error);
    const errorMsg =
      error?.errorMessage ||
      error?.response?.data?.message ||
      error?.message ||
      'Không thể kết nối đến server.';
    console.warn("Message được trả về cho UI:", errorMsg);
    throw new Error(errorMsg);
  }
};
export const completeRegistration = async (data) => {
  try {
    const response = await axiosInstance.post('/api/complete-registration', data);
    console.log("Phản hồi hoàn tất đăng ký:", response.data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Hoàn tất đăng ký thất bại.');
  }
};


export const forgotPassword = async (email, phone) => {
  try {
    const response = await axiosInstance.post("/api/forgot-password", {
      email,
      phone,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.message || "Không thể kết nối đến server. Vui lòng thử lại sau!"
    );
  }
};
