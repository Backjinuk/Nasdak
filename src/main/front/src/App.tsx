import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./LoginComponont/Login";
import LedgerMain from "./LedgerComponont/LedgerMain";

function App() {

  return (
    <div className="App">
      <header className="App-header">
          <Router>
              <Routes>
                  <Route path={"/*"} element={<Login/>}/>
                  <Route path={"/Ledger"} element={<LedgerMain/>}/>
              </Routes>
          </Router>
      </header>
    </div>
  );
}

export default App;
