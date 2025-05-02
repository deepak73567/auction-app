const API_BASE = "https://auction-plateform-xxjg.onrender.com";
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import axios from "axios";
import { toast } from "react-toastify";

// Replace with actual imports
import auctionReducer from "./auctionSlice"; // <--- Replace with your actual auction reducer
import bidReducer from "./bidSlice"; // <--- Replace with your actual bid reducer

// ==============================
// Initial State
// ==============================

const initialState = {
  loading: false,
  isAuthenticated: false,
  user: {},
  leaderboard: [],
  error: null,
  otp: "",
  step: 1, // 1: Enter Email, 2: Enter OTP, 3: New Password
  email: "",
};

// ==============================
// Slice
// ==============================

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Auth
    registerRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    loginRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    logoutFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchUserRequest: (state) => {
      state.loading = true;
    },
    fetchUserSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },

    // Leaderboard
    fetchLeaderboardRequest: (state) => {
      state.loading = true;
      state.leaderboard = [];
    },
    fetchLeaderboardSuccess: (state, action) => {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // OTP Flow
    otpRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    otpSuccess: (state, action) => {
      state.loading = false;
      toast.success(action.payload);
    },
    otpFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },
    resetRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    resetSuccess: (state, action) => {
      state.loading = false;
      toast.success(action.payload);
      state.step = 1;
      state.otp = "";
      state.email = "";
    },
    resetFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload);
    },

    // Helpers
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    clearAllErrors: (state) => {
      state.error = null;
    },
  },
});

// ==============================
// Combine Reducers and Store
// ==============================

const rootReducer = combineReducers({
  user: userSlice.reducer,
  auction: auctionReducer,
  bid: bidReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

// ==============================
// API Thunks
// ==============================


const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const { data: response } = await axios.post(`${API_BASE}/api/v1/user/register`, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(userSlice.actions.registerSuccess(response));
    toast.success(response.message);
  } catch (error) {
    const errMsg = error.response?.data?.message || "Registration failed";
    dispatch(userSlice.actions.registerFailed(errMsg));
    toast.error(errMsg);
  }
};

const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const { data: response } = await axios.post(`${API_BASE}/api/v1/user/login`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(userSlice.actions.loginSuccess(response));
    toast.success(response.message);
  } catch (error) {
    const errMsg = error.response?.data?.message || "Login failed";
    dispatch(userSlice.actions.loginFailed(errMsg));
    toast.error(errMsg);
  }
};

const logout = () => async (dispatch) => {
  try {
    const { data: response } = await axios.get(`${API_BASE}/api/v1/user/logout`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.message);
  } catch (error) {
    const errMsg = error.response?.data?.message || "Logout failed";
    dispatch(userSlice.actions.logoutFailed(errMsg));
    toast.error(errMsg);
  }
};

const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const { data: response } = await axios.get(`${API_BASE}/api/v1/user/me`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchUserSuccess(response.user));
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to fetch user";
    dispatch(userSlice.actions.fetchUserFailed(errMsg));
  }
};

const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const { data: response } = await axios.get(`${API_BASE}/api/v1/user/leaderboard`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchLeaderboardSuccess(response.leaderboard));
  } catch (error) {
    const errMsg = error.response?.data?.message || "Leaderboard error";
    dispatch(userSlice.actions.fetchLeaderboardFailed(errMsg));
  }
};

const sendOtpForReset = (email) => async (dispatch) => {
  dispatch(userSlice.actions.otpRequest());
  try {
    const res = await axios.post(`${API_BASE}/api/v1/user/forgot-password`, { email }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    const message = res.data?.message || "OTP sent successfully";
    dispatch(userSlice.actions.otpSuccess(message));
    dispatch(userSlice.actions.setEmail(email));
    dispatch(userSlice.actions.setStep(2));

    return { success: true, message };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to send OTP";
    dispatch(userSlice.actions.otpFailed(errMsg));
    return { success: false, error: errMsg };
  }
};

const verifyOtp = ({ email, otp }) => async (dispatch) => {
  dispatch(userSlice.actions.otpRequest());
  try {
    const res = await axios.post(`${API_BASE}/api/v1/user/verify-otp`, { email, otp }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    dispatch(userSlice.actions.otpSuccess(res.data?.message || "OTP Verified!"));
    dispatch(userSlice.actions.setStep(3));
  } catch (error) {
    const errMsg = error.response?.data?.message || "Invalid OTP";
    dispatch(userSlice.actions.otpFailed(errMsg));
    throw error;
  }
};

const verifyOtpAndResetPassword = (data) => async (dispatch) => {
  dispatch(userSlice.actions.resetRequest());
  try {
    const res = await axios.post(`${API_BASE}/api/v1/user/reset-password`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    const message = res.data?.message || "Password reset successful";
    dispatch(userSlice.actions.resetSuccess(message));

    return { success: true, message };
  } catch (error) {
    const errMsg = error.response?.data?.message || "Password reset failed";
    dispatch(userSlice.actions.resetFailed(errMsg));

    return { success: false, error: errMsg };
  }
};

// ==============================
// Exports
// ==============================

export {
  store,
  persistor,
  register,
  login,
  logout,
  fetchUser,
  fetchLeaderboard,
  sendOtpForReset,
  verifyOtp,
  verifyOtpAndResetPassword,
};

export const {
  setOtp,
  setStep,
  setEmail,
  clearAllErrors,
} = userSlice.actions;
