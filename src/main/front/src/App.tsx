import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

function App() {
  const [test, setTest] = useState();

  axios.post("/api/user/test")
      .then(res => {
        setTest(res.data)
      })


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {test}
        </a>
      </header>
    </div>
  );
}

export default App;
