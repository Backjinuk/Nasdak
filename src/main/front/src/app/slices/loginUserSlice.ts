import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCookie } from 'Cookies';
import { RootState } from 'app/store';
import axios from 'customFunction/customAxios';

const initialState = {
  isLogin: false,
  userNo: 0,
  userId: '',
  accessToken: '',
  refreshToken: '',
};

export const loginUserSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isLogin = true;
      const user = action.payload;
      state.userNo = user.userNo;
      state.userId = user.userId;
      state.accessToken = user.accessToken;
      state.refreshToken = user.refreshToken;
    },
    logoutUser: (state) => {
      state = initialState;
    },
  },
  extraReducers(builder) {
    builder.addCase(axiosGetUserNo.fulfilled, (state, action) => {
      state.isLogin = true;
      const userNo = action.payload;
      state.userNo = userNo;
      sessionStorage.setItem('userNo', userNo);
      sessionStorage.setItem('userDto', JSON.stringify({ userNo }));
    });
  },
});

export const axiosGetUserNo = createAsyncThunk('loginUser/axiosGetUserNo', async () => {
  const accessToken = getCookie('accessToken');
  const res = await axios.post('/api/token/getUserNo', JSON.stringify({ accessToken }));
  return res.data;
});

export const { loginUser, logoutUser } = loginUserSlice.actions;

export default loginUserSlice.reducer;

export const selectIsLogin = (state: RootState) => state.loginUser.isLogin;
