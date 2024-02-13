import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import LedgerMain from './LedgerComponont/LedgerMain';
import { CookiesProvider } from 'react-cookie';
import MapLocation from './MapComponont/MapLocation';
import Login from 'UserComponont/Login';
import UserInfo from 'UserComponont/UserInfo';
import FindUser from 'UserComponont/FindUser';
import SNSLogin from 'UserComponont/snsComponent/SNSLogin';
import CalenderMain from './CalenderCompoont/CalenderMain';
import KakaoLogout from 'UserComponont/snsComponent/KakaoLogout';
import TopBar from './TopBar';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectAllCategories } from 'app/slices/categoriesSlice';
import './firebase';
import { connect, useSelector } from 'react-redux';
import { RootState } from './app/store';
import { axiosGetUserNo, selectIsLogin } from 'app/slices/loginUserSlice';
import { getCookie } from 'Cookies';
import { useEffect } from 'react';
import LedgerMain2 from './LedgerComponont/LedgerMain2';

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
  const storeLogin = useSelector(selectIsLogin);
  const cookieLogin = getCookie('accessToken') !== undefined;
  const isLogin = storeLogin || cookieLogin;

  useEffect(() => {
    if (!storeLogin && cookieLogin) dispatch(axiosGetUserNo());
  }, []);

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
      <Route path={'/kakaoLogout'} element={<KakaoLogout />} />

      <Route path='/Ledger' element={<LedgerMain event={event} categoryList={categoryList} />} />
      <Route path='/Ledger2' element={<LedgerMain2 event={event} categoryList={categoryList} />} />

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
              <Route path='*' element={<Navigate to='/' replace />} />
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
const notShowTopBar = ['/', '/findId', '/snsLogin', '/kakaoLogout'];
