import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionData } from "../types";

interface AuthState extends SessionData {
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setSession(state, action: PayloadAction<SessionData>) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.tokens = null;
      state.error = null;
    },
  },
});

export const { setLoading, setSession, setError, clearSession } =
  authSlice.actions;
export default authSlice.reducer;
