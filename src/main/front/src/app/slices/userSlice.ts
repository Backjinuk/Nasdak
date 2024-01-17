import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SnsType, UserType } from 'TypeList';
import { RootState } from 'app/store';
import axios from 'axios';
import { Sns, User } from 'classes';
import { formHeader, jsonHeader } from 'headers';

const initialState: { user: UserType; status: string; error: string } = {
  user: { ...new User() },
  status: 'idle',
  error: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    dropUserInfo: (state) => {
      state.status = 'idle';
      state.user = { ...new User() };
    },
    connectSns: (state, action) => {
      const snsType: string = action.payload;
      const sns = Sns.getByData({ snsType });
      state.user.snsDtoList.push({ ...sns });
    },
    disConnectSns: (state, action) => {
      const snsType: string = action.payload;
      state.user.snsDtoList = state.user.snsDtoList.filter((sns) => sns.snsType !== snsType);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(axiosGetUser.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(axiosGetUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = state.user;
        Object.assign(user, action.payload);
      })
      .addCase(axiosGetUser.rejected, (state, action) => {
        state.status = 'failed';
        const message = action.error.message;
        if (message !== undefined) state.error = message;
      })
      .addCase(axiosUpdateUser.fulfilled, (state, action) => {
        const user = state.user;
        Object.assign(user, action.payload);
      })
      .addCase(axiosUpdateSnsUser.fulfilled, (state, action) => {
        const user = state.user;
        user.userId = action.payload.userId;
        user.password = action.payload.password;
      });
  },
});

export const axiosGetUser = createAsyncThunk('user/axiosGetUser', async (userNo: number) => {
  const res = await axios.post('/api/user/getUserInfo', JSON.stringify({ userNo }), jsonHeader);
  return res.data;
});

export const axiosUpdateUser = createAsyncThunk(
  'user/axiosUpdateUser',
  async ({ user, uploadFile, existingFile }: { user: UserType; uploadFile: any; existingFile: string }) => {
    await axios.post('/api/user/updateUserInfo', JSON.stringify(user), jsonHeader);
    //새로 등록시 업로드
    if (uploadFile !== undefined) {
      updateUserProfile(user, uploadFile);
      //프로필 삭제 시
    } else if (user.profile === '') {
      deleteUserProfile(user, existingFile);
    }
    return user;
  }
);

export const axiosDeleteUser = createAsyncThunk('user/axiosDeleteUser', async (userNo: number) => {
  await axios.post('/api/user/deleteUser', JSON.stringify({ userNo }), jsonHeader);
});

export const axiosConnectSns = createAsyncThunk(
  'user/axiosConnectSns',
  async (map: { code: string; state: string; snsType: string; userNo: number }) => {
    const res = await axios.post('/api/sns/connect', JSON.stringify(map), jsonHeader);
    return res.data;
  }
);

export const axiosDisconnectSns = createAsyncThunk('user/axiosDisconnectSns', async (sns: SnsType) => {
  const res = await axios.post('/api/sns/disconnect', JSON.stringify(sns), jsonHeader);
  return res.data;
});

export const axiosUpdateSnsUser = createAsyncThunk('user/axiosUpdateSnsUser', async (user: UserType) => {
  const res = await axios.post('/api/user/updateSNSUser', JSON.stringify(user), jsonHeader);
  return res.data;
});

export const { dropUserInfo, connectSns, disConnectSns } = userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.user;

const updateUserProfile = async (user: UserType, uploadFile: any) => {
  const fd = new FormData();
  fd.append('mf', uploadFile);
  fd.append('userNo', String(user.userNo));
  fd.append('before', user.profile);
  const res = await axios.post('/api/user/updateProfile', fd, formHeader);
  user.profile = res.data;
};

const deleteUserProfile = (user: UserType, existingFile: string) => {
  const data = {
    userNo: user.userNo,
    profile: existingFile,
  };
  axios.post('/api/user/deleteProfile', JSON.stringify(data), jsonHeader);
};
