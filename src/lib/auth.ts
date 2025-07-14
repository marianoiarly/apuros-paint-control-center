// Mock authentication for ApurosPDV
export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

export const DEFAULT_CREDENTIALS = {
  username: 'apuros',
  password: 'apuroscode'
};

export const MOCK_USER: User = {
  id: '1',
  username: 'apuros',
  name: 'Administrador',
  role: 'admin'
};

export const login = async (username: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
    localStorage.setItem('apuros_user', JSON.stringify(MOCK_USER));
    return MOCK_USER;
  }
  
  return null;
};

export const logout = () => {
  localStorage.removeItem('apuros_user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('apuros_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};