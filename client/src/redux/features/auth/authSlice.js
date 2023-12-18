import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { json } from 'express';

const initialState = {
  action: 'Create Your Account',
  email: '',
  password: ''
};

export const  signUpUser = createAsyncThunk('signupuser', async()=>{
  const res = await fetch("ddd",{
    method:"post",
    headers:{
      "Content-Type":"application/json"

    },
    body: JSON.stringify(body)
  })
  return await res.json();
})

export const loginSignupSlice = createSlice({
  name: 'loginSignup',
  initialState,
  reducers: {
    setAction: (state, action) => {
      state.action = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
  extraReducers:  {
    [signUpUser.pending]: (state,action)=>{
      state.loading = true
    },
    [signUpUser.pending]: (state,{payloaad:{error,msg}})=>{
      state.loading = false;
      if(error){
        state.error = error
      }else{
        state.msg = msg
      }
    },
    [signUpUser.pending]: (state,action)=>{
      state.loading = true
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAction,setEmail,setPassword } = loginSignupSlice.actions

export default loginSignupSlice.reducer