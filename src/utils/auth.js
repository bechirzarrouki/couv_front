// utils/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem('userName'); // Check if userToken exists in localStorage
};
export const getUserRole = () => {
  const user = localStorage.getItem('userRole');
  return user ; // Default to 'guest' if no role found
};
