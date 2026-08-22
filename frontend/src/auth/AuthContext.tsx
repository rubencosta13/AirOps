import { createContext, useContext, useState, type ReactNode } from "react";
import { getCurrentUser, type User } from "../api/auth";
import { useNavigate } from "@tanstack/react-router";
import { api, setAccessToken as setApiAccessToken } from "../api/client";
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function login(token: string) {
    console.log("1. login called");

    try {
      setApiAccessToken(token);
      setAccessToken(token);

      console.log("2. token set");

      const user = await getCurrentUser();

      console.log("3. current user:", user);

      setUser(user);

      console.log("4. navigating");

      await navigate({
        to: "/",
      });

      console.log("5. navigation complete");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setApiAccessToken(null);
      setAccessToken(null);
      setUser(null);

      throw error;
    }
  }

  const logout = async () => {
    setIsLoggingOut(true);

    try {
      await api("/auth/logout", {
        method: "POST",
      });

      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoggingOut(false);
      await navigate({
        to: "/login",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: accessToken !== null,
        login,
        logout,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
