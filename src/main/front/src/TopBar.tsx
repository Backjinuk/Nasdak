import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CreateLeger from './LedgerComponont/CreateLeger';
import { useNavigate } from 'react-router-dom'; // 변경
import UserInfoButton from './UserComponont/UserInfoButton';
import Logout from './UserComponont/Logout';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { axiosGetCategoryList, selectAllCategories } from 'app/slices/categoriesSlice';

export default function TopBar({ ChangeEvent }: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // 변경
  const categoryList = useAppSelector(selectAllCategories);

  const categoryStatus = useAppSelector((state) => state.categories.status);

  useEffect(() => {
    const userNo = Number(sessionStorage.getItem('userNo'));
    if (categoryStatus === 'idle') {
      dispatch(axiosGetCategoryList(userNo));
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1, my: 2 }}>
      <AppBar position='static'>
        <Toolbar variant='dense' sx={{ height: '60px' }}>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <CreateLeger ChangeEvent={ChangeEvent} categoryList={categoryList} />
          <Button sx={{ color: '#fff' }} variant='outlined' onClick={() => navigate('/MapLocation')}>
            지도 모아보기
          </Button>
          <Button sx={{ color: '#fff' }} variant='outlined' onClick={() => navigate('/Ledger')}>
            메인페이지
          </Button>
          <Button sx={{ color: '#fff' }} variant='outlined' onClick={() => navigate('/calender')}>
            달력으로 보기
          </Button>
          <UserInfoButton />
          <Logout />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
