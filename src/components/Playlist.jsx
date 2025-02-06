import React, { useEffect, useState } from "react";

const Playlist = ({ accessToken, setTrackUri }) => {
  const [playlist, setPlaylist] = useState([]);

  const fetchPlaylist = async (token) => {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data.items;
  };

  useEffect(() => {
    if (accessToken) {
      fetchPlaylist(accessToken)
        .then((data) => setPlaylist(data))
        .catch((err) => console.error(err));
    }
  }, [accessToken]);

  return (
    <div className="w-3/5 overflow-hidden">
      <h3 className="text-white text-center">Your Playlist</h3>
      <div className="flex gap-4 p-4 overflow-x-auto">
        {playlist.length !== 0 &&
          playlist.map((item) => {
            return (
              <div
                key={item.id}
                className="flex-none w-32 p-4 bg-white rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer"
                onClick={() => setTrackUri(item.uri)}
              >
                <img
                  src={item.images[0].url}
                  alt="Playlist cover photo"
                  className="w-24 h-24 object-cover rounded-md shadow-md"
                />
                <div className="mt-2">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Playlist;
