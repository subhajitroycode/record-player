import React, { useEffect, useState } from "react";

const Playlist = ({ accessToken, setTrackUri }) => {
  const [playlist, setPlaylist] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

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
    <div className="sm:max-w-lg max-w-xs overflow-hidden">
      <h3 className="text-white text-center">Your Playlist</h3>
      <div className="flex gap-4 px-1 py-4 overflow-x-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {playlist.length !== 0 &&
          playlist.map((item) => {
            return (
              <div
                key={item.id}
                className={`flex-none w-32 p-4 rounded-lg shadow-md transition-transform hover:scale-105 cursor-pointer 
                  ${
                    selectedPlaylist === item.id
                      ? "bg-[#D8C4B6]"
                      : "bg-[#F5EFE7]"
                  }`}
                onClick={() => {
                  setTrackUri(item.uri);
                  setSelectedPlaylist(item.id);
                }}
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
