import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./UserComponont/Login";
import LedgerMain from "./LedgerComponont/LedgerMain";
import UserInfo from "UserComponont/UserInfo";
import { CookiesProvider } from "react-cookie";
import FindUser from "UserComponont/FindUser";
import NaverLogin from "UserComponont/snsComponent/NaverLogin";
import MapLocation from "./MapComponont/MapLocation";
import KakaoLogin from "UserComponont/snsComponent/KakaoLogin";
import KakaoInit from "UserComponont/snsComponent/KakaoInit";
import KakaoLogout from "UserComponont/snsComponent/KakaoLogout";
declare global {
  interface Window {
    naver?: any;
    Kakao?: any;
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CookiesProvider>
          <Router>
              <Routes>
                  <Route path={"/*"} element={<Login/>}/>
                  <Route path={"/Ledger"} element={<LedgerMain/>}/>
                  <Route path={"/userInfo"} element={<UserInfo/>}/>
                  <Route path={"/findId"} element={<FindUser/>}/>
                  <Route path={"/naver"} element={<NaverLogin/>}/>
                  <Route path={"/kakao"} element={<KakaoLogin/>}/>
                  <Route path={"/kakaoInit"} element={<KakaoInit/>}/>
                  <Route path={"/kakaoLogout"} element={<KakaoLogout/>}/>
                  <Route path={"/MapLocation"} element={<MapLocation/>} />
              </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

export default App;
