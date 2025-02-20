import { create } from "zustand";

import type { UserResponse } from "../api/user/types";

interface AuthStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  user?: UserResponse;
  setUser: (user: UserResponse) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

  user: undefined,
  setUser: (user: UserResponse) => set({ user }),
}));
