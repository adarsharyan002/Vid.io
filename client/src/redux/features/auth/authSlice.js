import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Make API call to your backend endpoint
      const response = await fetch('https://vid-io-api.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error)
        throw new Error(error.msg);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      // Extract necessary data from response (e.g., token, user details)
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userDetails, { rejectWithValue }) => {
    try {
      // Make API call to your backend's signup endpoint
      const response = await fetch('https://vid-io-api.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error)
        throw new Error(error.msg);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      // Extract necessary data from response (e.g., token, user details)
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearState: (state) => {
      // Reset the authentication state to initial values
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        // ... your login success log
        state.loading = false;
        state.isAuthenticated = true; // If signup automatically logs in
        state.user = action.payload; // Assuming user data is in payload
        state.error = null;
        
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        // Handle successful signup (e.g., store user data, redirect)
        state.loading = false;
        state.isAuthenticated = true; // If signup automatically logs in
        state.user = action.payload; // Assuming user data is in payload
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Error message
      });
  },
});

export const { clearState } = authSlice.actions;

export default authSlice.reducer;
