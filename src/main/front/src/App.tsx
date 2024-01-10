import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LedgerMain from "./LedgerComponont/LedgerMain";
import { CookiesProvider } from "react-cookie";
import MapLocation from "./MapComponont/MapLocation";
import Login from "UserComponont/Login";
import UserInfo from "UserComponont/UserInfo";
import FindUser from "UserComponont/FindUser";
import SNSLogin from "UserComponont/snsComponent/SNSLogin";
import CalenderMain from "./CalenderCompoont/CalenderMain";
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
                  {/* 로그인 관련 */}
                  <Route path={"/*"} element={<Login/>}/>
                  <Route path={"/userInfo"} element={<UserInfo/>}/>
                  <Route path={"/findId"} element={<FindUser/>}/>
                  <Route path={"/snsLogin"} element={<SNSLogin/>}/>
                  <Route path={"/kakaoInit"} element={<KakaoInit/>}/>
                  <Route path={"/kakaoLogout"} element={<KakaoLogout/>}/>
                  {/* 로그인 관련 */}

                  <Route path={"/Ledger"} element={<LedgerMain/>}/>
                  <Route path={"/MapLocation"} element={<MapLocation/>} />
                  <Route path={"/calender"} element={<CalenderMain/>} />
              </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

export default App;
