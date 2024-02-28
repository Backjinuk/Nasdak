import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import LedgerMain from './LedgerComponont/LedgerMain';
import { CookiesProvider } from 'react-cookie';
import MapLocation from './MapComponont/MapLocation';
import Login from 'UserComponont/Login';
import UserInfo from 'UserComponont/UserInfo';
import FindUser from 'UserComponont/FindUser';
import SNSLogin from 'UserComponont/snsComponent/SNSLogin';
import CalenderMain from './CalenderCompoont/CalenderMain';
import TopBar from './TopBar';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectAllCategories } from 'app/slices/categoriesSlice';
import './firebase';
import { connect, useSelector } from 'react-redux';
import { RootState } from './app/store';
import { getCookie, setCookie } from 'Cookies';
import axios from 'customFunction/customAxios';
import { login, selectIsLogin } from 'app/slices/userSlice';

declare global {
  interface Window {
    naver?: any;
    Kakao?: any;
  }
}

function App() {
  const dispatch = useAppDispatch();
  const categoryList = useAppSelector(selectAllCategories);
  const event = useSelector((state: RootState) => state.ledger.event);
  const isLogin = useAppSelector(selectIsLogin);
  if (!isLogin && getCookie('refreshToken')) {
    try {
      requestRefreshToken(getCookie('refreshToken'));
    } catch (error) {
      setCookie('accessToken', '', { maxAge: 0 });
      setCookie('refreshToken', '', { maxAge: 0 });
      window.location.href = '/';
    }
  }

  async function requestRefreshToken(refreshToken: string) {
    const location = window.location.href;
    const res = await axios.public.post('/api/token/refreshToken', JSON.stringify({ refreshToken }));
    dispatch(login(res.data));
    window.location.href = location;
  }

  const publicRoutes = (
    <>
      <Route path={'/'} element={<Login />} />
      <Route path={'/findId'} element={<FindUser />} />
      <Route path={'/snsLogin'} element={<SNSLogin />} />
    </>
  );

  const privateRoutes = (
    <>
      <Route path={'/userInfo'} element={<UserInfo />} />
      <Route path='/Ledger' element={<LedgerMain event={event} categoryList={categoryList} />} />
      <Route path={'/MapLocation'} element={<MapLocation event={event} />} />
      <Route path={'/calender'} element={<CalenderMain categoryList={categoryList} event={event} />} />
    </>
  );

  return (
    <div className='App'>
      <header className='App-header'>
        <CookiesProvider>
          <Router>
            <ViewTopBar isLogin={isLogin} />
            <Routes>
              {publicRoutes}
              {isLogin && privateRoutes}
              <Route path='*' element={<Navigate to={isLogin ? '/ledger' : '/'} replace />} />
            </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

function ViewTopBar({ isLogin }: { isLogin: boolean }) {
  const { pathname } = useLocation();
  const isShowTopBar = isLogin && !notShowTopBar.includes(String(pathname));

  return <>{isShowTopBar && <TopBar />}</>;
}

export default App;
const notShowTopBar = ['/', '/findId', '/snsLogin'];
