import React, { useEffect, useState } from "react";

const Login = ({ setAccessToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const scope =
    "user-read-private user-read-email playlist-read-private streaming";
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const authenticate = async () => {
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    window.localStorage.setItem("code_verifier", codeVerifier);

    const params = {
      response_type: "code",
      client_id: clientId,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  const getToken = async (code) => {
    try {
      const codeVerifier = localStorage.getItem("code_verifier");
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch token");

      const data = await response.json();
      if (!data.access_token) throw new Error("Invalid token response");

      return data;
    } catch (error) {
      console.error("Token error:", error);
      return null;
    }
  };

  const handleAuth = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");

    if (code) {
      getToken(code)
        .then((response) => {
          localStorage.setItem("access_token", response.access_token);
          const expiresIn = response.expires_in;
          const expirationTime = Date.now() + expiresIn * 1000;
          localStorage.setItem("token_expiration", expirationTime.toString());
          setAccessToken(response.access_token);
        })
        .catch((err) => console.error(err));
    } else {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const tokenExpiration = localStorage.getItem("token_expiration");

    if (
      storedToken &&
      tokenExpiration &&
      Date.now() < parseInt(tokenExpiration)
    ) {
      setAccessToken(storedToken);
    } else {
      handleAuth();
    }
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full justify-center items-center z-10 bg-[#333]"
      style={{ display: isModalOpen ? "flex" : "none" }}
    >
      <div className="bg-white p-8 rounded-xl text-center w-11/12 sm:max-w-[400px] sm:w-full">
        <h2 className="text-2xl mb-4 font-bold">Welcome to Record Player</h2>
        <p className="mb-4 text-[#666]">
          Connect your Spotify* to start playing your favourite music with a
          vinyl experience.
          <span className="block font-semibold text-zinc-400 mt-4 text-sm">
            *You need Spotify premium to play music
          </span>
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
