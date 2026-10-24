import {
  createContext,
  useContext,
  useState,
} from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api";
const TOKEN_KEY = "staymatch_token";
const USER_KEY = "staymatch_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  function saveAuth(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  }

  async function signup(formData) {
    const response = await axios.post(
      `${API_URL}/auth/signup`,
      formData
    );

    saveAuth(response.data);
    return response.data;
  }

  async function login(credentials) {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      credentials
    );

    saveAuth(response.data);
    return response.data;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  }

  async function getCurrentUser() {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.get(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(response.data.user)
      );

      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }

      throw error;
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    signup,
    login,
    logout,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}