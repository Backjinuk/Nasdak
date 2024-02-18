import { Button } from '@mui/material';
import { getCookie, setCookie } from 'Cookies';
import { useAppDispatch } from 'app/hooks';
import { useNavigate } from 'react-router-dom';
import axios from 'customFunction/customAxios';
import { axiosLogout, logout } from 'app/slices/userSlice';
import { dropCategories } from 'app/slices/categoriesSlice';

export default function Logout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleClick() {
    const refreshToken = getCookie('refreshToken');
    await dispatch(axiosLogout(refreshToken));
    dispatch(dropCategories());
    dispatch(logout());
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
