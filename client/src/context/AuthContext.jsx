import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    const userData = sessionStorage.getItem("userData");

    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const login = (userData) => {
    sessionStorage.setItem("userToken", userData.token);
    sessionStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("cart");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    sessionStorage.setItem("userData", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const isAuthenticated = () => {
    return !!user || !!sessionStorage.getItem("userToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};