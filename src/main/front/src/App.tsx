import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./UserComponont/Login";
import LedgerMain from "./LedgerComponont/LedgerMain";
import UserInfo from "UserComponont/UserInfo";
import { CookiesProvider } from "react-cookie";
import FindUser from "UserComponont/FindUser";

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
              </Routes>
          </Router>
        </CookiesProvider>
      </header>
    </div>
  );
}

export default App;
