import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LedgerMain from "./LedgerComponont/LedgerMain";
import { CookiesProvider } from "react-cookie";
import MapLocation from "./MapComponont/MapLocation";
import Login from "UserComponont/Login";
import UserInfo from "UserComponont/UserInfo";
import FindUser from "UserComponont/FindUser";
import NaverLogin from "UserComponont/snsComponent/NaverLogin";
import CalenderMain from "./CalenderCompoont/CalenderMain";
import KakaoLogin from "UserComponont/snsComponent/KakaoLogin";
import KakaoInit from "UserComponont/snsComponent/KakaoInit";
import KakaoLogout from "UserComponont/snsComponent/KakaoLogout";
import TopBar from "./TopBar";
import * as React from "react";
import {useEffect, useState} from "react";
import {CategoryType, LedgerType} from "./TypeList";
import axios from "axios";
import userEvent from "@testing-library/user-event";

declare global {
  interface Window {
    naver?: any;
    Kakao?: any;
  }
}


function App() {
    const [categoryList, setCategoryList] = useState();
    const [ledgerList, setLedgerList] = useState<LedgerType[]>()
    function isCategoryList(value : any){
        setCategoryList(value);
    }

    function isLedgerList( value : LedgerType[]) {
        setLedgerList(value);
    }

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
              <Route path={"/naver"} element={<NaverLogin/>}/>
              <Route path={"/kakao"} element={<KakaoLogin/>}/>
              <Route path={"/kakaoInit"} element={<KakaoInit/>}/>
              <Route path={"/kakaoLogout"} element={<KakaoLogout/>}/>
              {/* 로그인 관련 */}


                  <Route path="/Ledger"
                      element={
                          <>
                              <TopBar isCategoryList={(value: any) => isCategoryList(value)} categoryList={categoryList} />
                              <LedgerMain categoryList={categoryList} isLedgerList={(value : LedgerType[]) => isLedgerList(value)} />
                          </>
                      }
                  />
                  <Route path={"/MapLocation"} element={<>
                      <TopBar isCategoryList={(value: any) => isCategoryList(value)} categoryList={categoryList} />
                      <MapLocation />
                  </>} />
                  <Route path={"/calender"} element={<>
                      <TopBar isCategoryList={(value: any) => isCategoryList(value)} categoryList={categoryList} />
                      <CalenderMain  ledgerList={ledgerList}/>
                  </>} />
              </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

export default App;
