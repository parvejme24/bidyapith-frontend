import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role, UserSession } from "@/lib/app-types";

interface AuthState {
  token: string | null;
  role: Role;
  user: UserSession | null;
  isAuthenticated: boolean;
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("bidyapith_access_token");
    } catch {
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  token: getInitialToken(),
  role: "student",
  user: null,
  isAuthenticated: Boolean(getInitialToken()),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; role?: Role; user?: UserSession }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.role) state.role = action.payload.role;
      if (action.payload.user) state.user = action.payload.user;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("bidyapith_access_token", action.payload.token);
        } catch {}
      }
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
    setUser: (state, action: PayloadAction<UserSession>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("bidyapith_access_token");
          localStorage.removeItem("bidyapith_user");
        } catch {}
      }
    },
  },
});

export const { setCredentials, setRole, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
