

export const createUrl = (href) => {
  const app = process.env.REACT_APP_URL;
  return `${app}${href}`;
}

export const isAuthenticated = () => {
  return localStorage.getItem('token') != null;
}
