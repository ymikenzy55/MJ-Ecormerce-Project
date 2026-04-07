const REDIRECT_KEY = 'redirectAfterAuth';

export const saveRedirectPath = (path) => {
  if (path && path !== '/login' && path !== '/register') {
    localStorage.setItem(REDIRECT_KEY, path);
  }
};

export const getRedirectPath = () => {
  return localStorage.getItem(REDIRECT_KEY) || '/';
};

export const clearRedirectPath = () => {
  localStorage.removeItem(REDIRECT_KEY);
};

export const redirectAfterAuth = (navigate) => {
  const path = getRedirectPath();
  clearRedirectPath();
  navigate(path);
};
