import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./LoginComponont/Login";

function App() {

  return (
    <div className="App">
      <header className="App-header">
          <Router>
              <Routes>
                  <Route path={"/*"} element={<Login/>}/>
              </Routes>
          </Router>
      </header>
    </div>
  );
}

export default App;
