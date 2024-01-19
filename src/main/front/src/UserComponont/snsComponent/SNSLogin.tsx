import { Box, CircularProgress } from '@mui/material';
import { UserType } from 'TypeList';
import { axiosConnectSns, connectSns } from 'app/slices/userSlice';
import axios, { AxiosError } from 'axios';
import { jsonHeader } from 'headers';

export default function SNSLogin() {
  const data = window.location.href.split('?')[1];
  const state = JSON.parse(window.opener.sessionStorage.getItem('snsState'));
  const userNo = window.opener.sessionStorage.getItem('userNo');
  const snsType = state.snsType;
  const action = state.action;
  let map = {
    code: '',
    state: '',
    snsType: snsType,
    userNo: userNo,
  };
  data.split('&').forEach((item) => {
    const [key, val] = item.split('=');
    map = { ...map, [key]: val };
  });

  switch (action) {
    case 'login':
      login(map);
      break;
    case 'connect':
      connect(map);
      break;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

async function login(map: any) {
  try {
    const res = await axios.post('/api/sns/login', JSON.stringify(map), jsonHeader);
    window.opener.snsLoginNavigate(res.data.userNo, res.data.snsType, res.data.accessToken);
    if (res.data.snsType === 'KAKAO') {
      window.opener.Kakao.Auth.setAccessToken(res.data.accessToken);
    }
    window.close();
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      window.opener.setSnsKey(data.key);
      setExistUsers(data.existUsers);
      window.opener.handleOpenExistUsers();
      window.close();
    } else {
      alert('error');
      console.log(error);
    }
  }
}

async function connect(map: any) {
  const dispatch = window.opener.dispatch;
  try {
    await dispatch(axiosConnectSns(map));
  } catch (error) {
    if (error instanceof AxiosError) {
      window.opener.sessionStorage.setItem('dbSnsNo', error.response?.data);
      window.opener.handleChangeSnsDialogOpen();
    } else {
      alert('error!');
    }
  }
  window.close();
}

const setExistUsers = (data: { email: UserType; phone: UserType }) => {
  window.opener.setExistUsers(data);
};
