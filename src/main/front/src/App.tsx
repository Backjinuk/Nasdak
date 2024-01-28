import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LedgerMain from './LedgerComponont/LedgerMain';
import { CookiesProvider } from 'react-cookie';
import MapLocation from './MapComponont/MapLocation';
import Login from 'UserComponont/Login';
import UserInfo from 'UserComponont/UserInfo';
import FindUser from 'UserComponont/FindUser';
import SNSLogin from 'UserComponont/snsComponent/SNSLogin';
import CalenderMain from './CalenderCompoont/CalenderMain';
import KakaoInit from 'UserComponont/snsComponent/KakaoInit';
import KakaoLogout from 'UserComponont/snsComponent/KakaoLogout';
import TopBar from './TopBar';
import { useEffect} from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectAllCategories } from 'app/slices/categoriesSlice';
import { dropUserInfo } from 'app/slices/userSlice';
import './firebase';
import {connect, useSelector} from "react-redux";
import {RootState} from "./app/store";

declare global {
  interface Window {
    naver?: any;
    Kakao?: any;
  }
}

function App() {
  const categoryList = useAppSelector(selectAllCategories);
  const event = useSelector( (state : RootState) => state.ledger.event);

  const mapStateToProps = (state: { categoryList: any; event: any; }) => {
    return {
      categoryList: state.categoryList, // state의 구조에 따라 적절하게 수정하세요.
      event: state.event // state의 구조에 따라 적절하게 수정하세요.
    };
  };

  const ConnectedLedgerMain = connect(mapStateToProps)(LedgerMain);

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
              <Route path={'/kakaoInit'} element={<KakaoInit />} />
              <Route path={'/kakaoLogout'} element={<KakaoLogout />} />
              {/* 로그인 관련 */}

              <Route
                path='/Ledger'
                element={ <LedgerMain event={event} categoryList={categoryList}/>} />
              <Route path={'/MapLocation'} element={<MapLocation event={event} />} />
              <Route
                path={'/calender'}
                element={<CalenderMain categoryList={categoryList} event={event}/> }
              />
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
