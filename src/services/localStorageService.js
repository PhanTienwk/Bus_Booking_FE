export const KEY_TOKEN = "accessToken";
export const ROLE_USER = "role_user";

export const setToken = (token) => {
  localStorage.setItem(KEY_TOKEN, token);
};

export const setRole = (role) => {
  localStorage.setItem(ROLE_USER, role);
};

export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_USER);
};

export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};
