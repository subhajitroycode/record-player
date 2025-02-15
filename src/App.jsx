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
  const [isSDKReady, setIsSDKReady] = useState(false);

  // Load Spotify SDK Script
  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      setIsSDKReady(true);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [accessToken]);

  // Initialize Player after SDK is ready
  useEffect(() => {
    if (!accessToken || !isSDKReady) return;

    const newPlayer = new window.Spotify.Player({
      name: "Record Player",
      getOAuthToken: (cb) => cb(accessToken),
      volume: 0.5,
    });

    // Error handling
    newPlayer.addListener("initialization_error", ({ message }) => {
      console.error("Failed to initialize:", message);
    });

    newPlayer.addListener("authentication_error", ({ message }) => {
      console.error("Failed to authenticate:", message);
      setAccessToken(null);
      localStorage.removeItem("access_token");
    });

    newPlayer.addListener("account_error", ({ message }) => {
      console.error("Failed to validate Spotify account:", message);
    });

    newPlayer.addListener("playback_error", ({ message }) => {
      console.error("Failed to perform playback:", message);
    });

    // Playback status updates
    newPlayer.addListener("player_state_changed", (state) => {
      if (state) {
        console.log("Player State:", state);
      }
    });

    // Ready
    newPlayer.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID:", device_id);
      setDeviceId(device_id);
    });

    // Not Ready
    newPlayer.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline:", device_id);
    });

    // Connect to the player
    newPlayer.connect().then((success) => {
      if (success) {
        console.log("The Web Playback SDK successfully connected to Spotify!");
        setPlayer(newPlayer);
      }
    });
  }, [accessToken, isSDKReady]);

  return (
    <>
      <Login setAccessToken={setAccessToken} />
      <div className="flex justify-evenly items-center flex-col xl:flex-row h-screen bg-[#333]">
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
