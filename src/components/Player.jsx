import React, { useEffect, useState } from "react";
import {
  FaBackwardStep,
  FaForwardStep,
  FaPause,
  FaPlay,
} from "react-icons/fa6";

const Player = ({ player, deviceId, trackUri, accessToken }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const playTrack = async () => {
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ context_uri: trackUri }),
        }
      );
    } catch (error) {
      alert("An error occurred while playing the track.");
      console.error(error);
    }
  };

  const getCoverImage = async (playlist_id) => {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist_id}/images`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  };

  const handlePlay = async () => {
    if (!player) return;

    if (!trackUri) {
      alert("Please select a playlist to play.");
      return;
    }

    if (!deviceId) {
      alert("You need Spotify premium to play music.");
      return;
    }

    const state = await player.getCurrentState();

    if (!state) {
      if (trackUri) {
        await playTrack();
        setIsPlaying(true);
      }
      return;
    }

    if (state.paused) {
      if (state.context?.uri === trackUri) {
        await player.resume();
      } else {
        await playTrack();
      }
      setIsPlaying(true);
    } else {
      await player.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!player) return;

    player.addListener("player_state_changed", (state) => {
      if (!state) {
        setIsPlaying(false);
        return;
      }

      setIsPlaying(!state.paused);
    });
  }, [player]);

  useEffect(() => {
    if (!trackUri) return;

    const parts = trackUri.split(":")[2];

    getCoverImage(parts)
      .then((data) => setImageSrc(data[0].url))
      .catch((err) => console.error(err));
  }, [trackUri]);

  // pause the player when trackUri changes
  useEffect(() => {
    if (!player) return;

    player.pause();
    setIsPlaying(false);
  }, [trackUri]);

  return (
    <>
      <div className="relative w-[480px]">
        <div className="relative w-80 h-80 bg-[#222] rounded-full my-0 mx-auto">
          <div
            className={`absolute top-[10px] left-[10px] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[#111] to-[#444] vinyl-animation ${
              isPlaying && "playing"
            }`}
          >
            <div className="absolute top-[25px] left-[25px] w-[250px] h-[250px] border-[1px] border-solid border-[#222] rounded-full pointer-events-none grooves"></div>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Playlist cover photo"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full object-cover"
              />
            ) : (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#d4af37] rounded-full flex justify-center items-center text-xs text-[#333]"></div>
            )}
          </div>
        </div>
        <div
          className="absolute top-16 right-12 w-36 h-[5px] bg-[#EB5B00] transition-transform duration-500"
          style={{
            transformOrigin: "right center",
            transform: isPlaying ? "rotate(-55deg)" : "rotate(-90deg)",
          }}
        ></div>
        <div className="text-center mt-5">
          <button
            className="py-[10px] px-5 mx-3 my-5 bg-[#d4af37] hover:bg-[#e5c047] border-none rounded cursor-pointer text-[#333]"
            onClick={async () => await player.previousTrack()}
          >
            <FaBackwardStep />
          </button>
          <button
            className="py-[10px] px-5 mx-3 my-5 bg-[#d4af37] hover:bg-[#e5c047] border-none rounded cursor-pointer text-[#333]"
            onClick={handlePlay}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            className="py-[10px] px-5 mx-3 my-5 bg-[#d4af37] hover:bg-[#e5c047] border-none rounded cursor-pointer text-[#333]"
            onClick={async () => await player.nextTrack()}
          >
            <FaForwardStep />
          </button>
        </div>
      </div>
    </>
  );
};

export default Player;
