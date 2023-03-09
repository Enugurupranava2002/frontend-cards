import { createSlice } from "@reduxjs/toolkit";

const initAuthState = {
  token: "",
  isAuth: false,
  expiryDate: null,
  userId: "",
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: initAuthState,
  reducers: {
    setCreds(state, action) {
      console.log(action);
      state.token = action.payload.token;
      state.expiryDate = action.payload.expiryDate;
      state.isAuth = action.payload.isAuth;
      state.userId = action.payload.userId;
    },
  },
});

export default authSlice.reducer;
export const authActions = authSlice.actions;
