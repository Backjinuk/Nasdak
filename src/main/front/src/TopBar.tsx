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
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { axiosGetCategoryList, selectAllCategories } from 'app/slices/categoriesSlice';
import { store } from './app/store';
import { changeEvent } from './app/slices/ledgerSilce';
import axios from 'customFunction/customAxios';

export default function TopBar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // 변경
  const categoryList = useAppSelector(selectAllCategories);
  const categoryStatus = useAppSelector((state) => state.categories.status);

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(axiosGetCategoryList());
    }

    //startEventTimer();
  }, []);

  const notification = async () => {
    const result = await axios.post(
      '/api/user/notification',
      JSON.stringify({ userNo: sessionStorage.getItem('userNo') })
    );

    if (result.data === 'on') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // 알림을 보냅니다.
          const notification = new Notification('Hello, User!', {
            body: '알림을 보냅니다.',
            icon: 'https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp',
            vibrate: [100, 50, 100],
          });

          notification.onclick = () => {
            window.open('https://naver.com', '_blank');
            notification.close();
          };
        }
      });
    }
  };

  //9시 이후 시작되는 이벤트
  const startEvent = async () => {
    let title = '';
    let body = '';

    const result = await axios.post(
      '/api/user/notification',
      JSON.stringify({ userNo: sessionStorage.getItem('userNo') })
    );

    if (result.data === 'on') {
      const today = await axios.post(
        '/api/ledger/ToDayLedger',
        JSON.stringify({ userNo: sessionStorage.getItem('userNo') })
      );

      if (today.data > 0) {
        title = '오늘 가계부 총 지출';
        body = `오늘 ${today.data}원 지출`;
      } else {
        title = '오늘 가계부의 지출은 없습니다.';
        body = '가계부를 잊지 말아 주세요';
      }

      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          // 알림을 보냅니다.
          const notification = new Notification(title, {
            body: body,
            icon: 'https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp',
            vibrate: [100, 50, 100],
          });

          notification.onclick = () => {
            window.open('https://naver.com', '_blank');
            notification.close();
          };
        }
      });
    }
  };

  function startEventTimer() {
    const currentDate = new Date();
    const targetTime = new Date();
    targetTime.setHours(21, 0, 0);

    let delay = targetTime.getTime() - currentDate.getTime();

    if (delay < 0) {
      targetTime.setDate(currentDate.getDate() + 1);
      delay = targetTime.getTime() - currentDate.getTime();
    }

    setTimeout(startEvent, 1000);
  }

  const ChangeEvent = () => {
    store.dispatch(changeEvent());
  };

  return (
    <Box sx={{ flexGrow: 1, my: 2 }}>
      <AppBar position='static'>
        <Toolbar variant='dense' sx={{ height: '60px' }}>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <CreateLeger ChangeEvent={ChangeEvent} categoryList={categoryList} />
          {/*<ConnectCreateLedger/>*/}
          <Button sx={{ color: '#fff' }} variant='outlined' onClick={() => navigate('/MapLocation', {
            state: {
              type: 'topBar'
            }}
          )}>
            지도 모아보기
          </Button>
          <Button sx={{ color: '#fff' }} variant='outlined' onClick={() => navigate('/Ledger')}>
            메인페이지
          </Button>
          <Button sx={{ color: '#fff' }} variant='outlined' onClick={() => navigate('/calender')}>
            달력으로 보기
          </Button>
          <Button sx={{ color: '#fff' }} variant='outlined' onClick={() => notification()}>
            알림 보내기
          </Button>
          <UserInfoButton />
          <Logout />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
