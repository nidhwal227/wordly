import logo from './logo.svg';
import './App.css';
import _ from 'lodash';
import Game from './Game';
import { Gamegrid } from './Game';
import { Login } from './auth';
import { useState } from 'react';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div className="App space-y-2">
      <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      {loggedIn && <Game loggedIn={loggedIn} />}
    </div>
  );
}
export default App;
