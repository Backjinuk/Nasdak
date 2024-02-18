import { Box, CircularProgress } from '@mui/material';
import { UserType } from 'TypeList';
import { axiosConnectSns } from 'app/slices/userSlice';
import axios from 'customFunction/customAxios';

export default function SNSLogin() {
  const data = window.location.href.split('?')[1];
  const state = JSON.parse(window.opener.sessionStorage.getItem('snsState'));
  const snsType = state.snsType;
  const action = state.action;
  let map = {
    authorities: '',
    snsType: snsType,
    result: '',
    key: '',
    snsNo: '',
    exist: false,
  };

  data.split('&').forEach((item) => {
    const [key, val] = item.split('=');
    map = { ...map, [key]: val };
  });

  map.exist = map.result === 'exist';

  executeAction(action, map);

  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}

async function executeAction(action: string, map: any) {
  switch (action) {
    case 'login':
      if (map.exist) {
        login(map.snsNo);
        break;
      }
      const data = await checkSignup(map.key);
      if (data.result) {
        selectNewConnection(data.key, data.existUsers);
      } else {
        signUp(data.key);
      }
      break;

    case 'connect':
      connect(map);
      break;
  }
}

async function login(snsNo: string) {
  const res = await axios.post('/api/sns/public/snsLogin', JSON.stringify({ snsNo }));
  loginNavigate(res.data);
  window.close();
}

async function checkSignup(key: string) {
  const res = await axios.post('/api/sns/public/isDuplicatedUserInfo', JSON.stringify({ key }));
  return res.data;
}

async function signUp(key: string) {
  const res = await axios.post('/api/sns/public/signUp', JSON.stringify({ key }));
  loginNavigate(res.data);
  window.close();
}

async function selectNewConnection(key: string, existUsers: UserType[]) {
  window.opener.setSnsKey(key);
  setExistUsers(existUsers);
  window.opener.handleOpenExistUsers();
  window.close();
}

async function connect(map: any) {
  const dispatch = window.opener.dispatch;
  const res = await dispatch(axiosConnectSns(map));
  if (res.error) {
    const error = res.error;
    if (error.name === 'AxiosError') {
      window.opener.sessionStorage.setItem('dbSnsNo', map.snsNo);
      window.opener.handleChangeSnsDialogOpen();
    }
  }

  window.close();
}

const setExistUsers = (data: UserType[]) => {
  window.opener.setExistUsers(data);
};

const loginNavigate = (data: any) => {
  window.opener.loginNavigate(
    data.accessToken,
    data.refreshToken,
    data.accessTokenExpiresIn,
    data.refreshTokenExpiresIn
  );
};
