import { configureStore } from "@reduxjs/toolkit";
import loginSignupReducer from "../features/auth/authSlice";

export default configureStore({
    reducer: {
        loginSignup : loginSignupReducer
    }
});