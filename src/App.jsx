import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Player from "./components/Player";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  return (
    <>
      <Login setAccessToken={setAccessToken} />
      <Player />
    </>
  );
}

export default App;
