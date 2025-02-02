import React, { useEffect, useState } from "react";

const Login = ({ setAccessToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const scopes =
    "user-read-private user-read-email playlist-read-private streaming";

  const authenticate = () => {
    const uri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes)}`;

    window.location.href = uri;
    setIsModalOpen(false);
  };

  const handleAuth = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      setAccessToken(accessToken);
      console.log("Logged in");
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full justify-center items-center z-10 bg-[#333]"
      style={{ display: isModalOpen ? "flex" : "none" }}
    >
      <div className="bg-white p-8 rounded-xl text-center max-w-[400px] w-full">
        <h2 className="text-2xl mb-4 font-bold">Welcome to Vinyl Player</h2>
        <p className="mb-6 text-[#666]">
          Connect your Spotify to start playing your favourite music with a
          vinyl experience.
        </p>
        <button
          className="bg-[#1db954] text-white border-none px-8 py-4 rounded-full text-base font-bold cursor-pointer transition-background duration-300 hover:bg-[#1ed760]"
          onClick={authenticate}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;
