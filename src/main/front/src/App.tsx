import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import { useEffect, useState } from 'react';
import { LedgerType } from './TypeList';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectAllCategories } from 'app/slices/categoriesSlice';
import { dropUserInfo } from 'app/slices/userSlice';
import './firebase';

declare global {
  interface Window {
    naver?: any;
    Kakao?: any;
  }
}

function App() {
  const categoryList = useAppSelector(selectAllCategories);
  const [ledgerList, setLedgerList] = useState<LedgerType[]>();
  const [event, setEvent] = useState(false);

  function isLedgerList(value: LedgerType[]) {
    setLedgerList(value);
  }
  const ChangeEvent = () => {
    console.log(11);
    event ? setEvent(false) : setEvent(true);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <CookiesProvider>
          <Router>
            <ViewTopBar />
            <Routes>
              {/* 로그인 관련 */}
              <Route path={'/'} element={<Login />} />
              <Route path={'/userInfo'} element={<UserInfo />} />
              <Route path={'/findId'} element={<FindUser />} />
              <Route path={'/snsLogin'} element={<SNSLogin />} />
              <Route path={'/kakaoLogout'} element={<KakaoLogout />} />
              {/* 로그인 관련 */}

              <Route
                path='/Ledger'
                element={
                  <LedgerMain
                    event={event}
                    categoryList={categoryList}
                    isLedgerList={(value: LedgerType[]) => isLedgerList(value)}
                  />
                }
              />
              <Route path={'/MapLocation'} element={<MapLocation />} />
              <Route path={'/calender'} element={<CalenderMain categoryList={categoryList} />} />
            </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

function ViewTopBar() {
  const dispatch = useAppDispatch();
  const isLogin = sessionStorage.getItem('userNo') !== null;
  const { pathname } = useLocation();
  const showTopBar = isLogin && !notShowTopBar.includes(String(pathname));
  useEffect(() => {
    if (!isLogin) {
      dispatch(dropUserInfo());
    }
  }, [isLogin, dispatch]);

  return <>{showTopBar && <TopBar />}</>;
}

export default App;
const notShowTopBar = ['/', '/findId', '/snsLogin', '/kakaoInit', '/kakaoLogout'];
