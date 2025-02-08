import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login";
import Player from "./components/Player";
import Playlist from "./components/Playlist";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [trackUri, setTrackUri] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    window.onSpotifyWebPlaybackSDKReady = () => {
      let newPlayer = new window.Spotify.Player({
        name: "Record Player",
        getOAuthToken: (cb) => cb(accessToken),
      });

      newPlayer.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };
  }, [accessToken]);

  return (
    <>
      <Login setAccessToken={setAccessToken} />
      <div className="flex justify-evenly items-center h-screen bg-[#333]">
        <Player
          player={player}
          deviceId={deviceId}
          trackUri={trackUri}
          accessToken={accessToken}
        />
        <Playlist accessToken={accessToken} setTrackUri={setTrackUri} />
      </div>
    </>
  );
}

export default App;
