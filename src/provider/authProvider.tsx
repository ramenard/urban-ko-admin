import { HttpError } from "react-admin";

const API_URL = import.meta.env.VITE_APP_API_URL || "/api";

export const authProvider = {
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Identifiants invalides" }));
      throw new Error(error.message || "Login failed");
    }

    const { token, user } = await response.json();

    // 🔒 Vérification du rôle
    if (!user || user.role !== "admin") {
      throw new Error("Accès refusé : vous n’êtes pas administrateur");
    }

    // 🔐 Stockage
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);

    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem("token") ? Promise.resolve() : Promise.reject(),

  checkError: (error: HttpError) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    const role = localStorage.getItem("role");
    return Promise.resolve(role);
  },
};
