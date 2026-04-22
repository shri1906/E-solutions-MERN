import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('userToken', userData.token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('cart'); // Clear cart on logout
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('userData', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
