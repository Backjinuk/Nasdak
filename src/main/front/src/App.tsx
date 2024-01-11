import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LedgerMain from "./LedgerComponont/LedgerMain";
import { CookiesProvider } from "react-cookie";
import MapLocation from "./MapComponont/MapLocation";
import Login from "UserComponont/Login";
import UserInfo from "UserComponont/UserInfo";
import FindUser from "UserComponont/FindUser";
import SNSLogin from "UserComponont/snsComponent/SNSLogin";
import CalenderMain from "./CalenderCompoont/CalenderMain";
import KakaoInit from "UserComponont/snsComponent/KakaoInit";
import KakaoLogout from "UserComponont/snsComponent/KakaoLogout";
import TopBar from "./TopBar";
import * as React from "react";
import {useEffect, useState} from "react";
import {CategoryType, LedgerType} from "./TypeList";
import  "./firebase";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import {useState} from "react";
import { useAppSelector } from "app/hooks";
import { selectAllCategories } from "app/slices/categoriesSlice";

declare global {
  interface Window {
    naver?: any;
    Kakao?: any;
  }
}

function App() {
    const categoryList = useAppSelector(selectAllCategories)
    const isLogin = sessionStorage.getItem('userNo') !== null
    const [ledgerList, setLedgerList] = useState<LedgerType[]>()
    const [event, setEvent] = useState(false)

    function isLedgerList( value : LedgerType[]) {
        setLedgerList(value);
    }
    function ChangeEvent () {
        event ? setEvent(false) : setEvent(true);
    }

  return (
    <div className="App">
        <header className="App-header">
          <CookiesProvider>
          <Router>
            {isLogin?<TopBar /> : ''}
            <Routes>
                  {/* 로그인 관련 */}
                  <Route path={"/*"} element={<Login/>}/>
                  <Route path={"/userInfo"} element={<UserInfo/>}/>
                  <Route path={"/findId"} element={<FindUser/>}/>
                  <Route path={"/snsLogin"} element={<SNSLogin/>}/>
                  <Route path={"/kakaoInit"} element={<KakaoInit/>}/>
                  <Route path={"/kakaoLogout"} element={<KakaoLogout/>}/>
                  {/* 로그인 관련 */}

                  <Route path="/Ledger" element={<LedgerMain categoryList={categoryList} isLedgerList={(value : LedgerType[]) => isLedgerList(value)} />} />
                  <Route path={"/MapLocation"} element={<MapLocation />} />
                  <Route path={"/calender"} element={<CalenderMain categoryList={categoryList} ChangeEvent={ChangeEvent}/>} />
              </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

export default App;
