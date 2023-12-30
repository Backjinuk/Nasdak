import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./UserComponont/Login";
import LedgerMain from "./LedgerComponont/LedgerMain";
import UserInfo from "UserComponont/UserInfo";
import { CookiesProvider } from "react-cookie";
import FindUser from "UserComponont/FindUser";
import NaverLogin from "UserComponont/NaverLogin";
declare global {
  interface Window {
    naver?: any;
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
                  <Route path={"/UserInfo"} element={<UserInfo/>}/>
                  <Route path={"/findId"} element={<FindUser/>}/>
                  <Route path={"/naver"} element={<NaverLogin/>}/>
              </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

export default App;
