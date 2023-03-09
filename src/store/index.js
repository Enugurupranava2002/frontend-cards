import { configureStore } from "@reduxjs/toolkit";

import authReducers from "./auth-slice";
import modalReducers from "./modal-slice";
import dataReducers from "./data-slice";

const store = configureStore({
  reducer: { auth: authReducers, modal: modalReducers, data: dataReducers },
});

export default store;
