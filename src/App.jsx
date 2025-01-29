import { useState } from "react";
import "./App.css";
import Login from "./components/Login";

function App() {
  const [accessToken, setAccessToken] = useState(null);

  return (
    <>
      <Login setAccessToken={setAccessToken} />
    </>
  );
}

export default App;
