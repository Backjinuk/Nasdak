import { Button } from '@mui/material';
import { setCookie } from 'Cookies';
import { useAppDispatch } from 'app/hooks';
import { logoutUser } from 'app/slices/loginUserSlice';
import { useNavigate } from 'react-router-dom';
import logout from './js/logout';

export default function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const snsType = sessionStorage.getItem('snsType');
  function handleClick() {
    if (snsType === 'KAKAO') {
      window.Kakao.Auth.setAccessToken(sessionStorage.getItem('accessToken'));
      window.Kakao.Auth.logout();
    }
    logout(dispatch);
    setCookie('accessToken', '', { maxAge: 0 });
    setCookie('refreshToken', '', { maxAge: 0 });
    dispatch(logoutUser());
    navigate('/');
  }

  return (
    <Button
      sx={{ color: '#fff' }}
      variant='outlined'
      onClick={() => {
        handleClick();
      }}
    >
      로그아웃
    </Button>
  );
}
