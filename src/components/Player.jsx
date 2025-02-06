import React, { useState } from "react";
import {
  FaBackwardStep,
  FaForwardStep,
  FaPause,
  FaPlay,
} from "react-icons/fa6";

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <div className="relative w-[400px] h-[300px]">
        <div className="relative w-[220px] h-[220px] bg-[#222] rounded-full my-0 mx-auto">
          <div
            className={`absolute top-[10px] left-[10px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-[#111] to-[#444] vinyl-animation ${
              isPlaying && "playing"
            }`}
          >
            <div className="absolute top-[25px] left-[25px] w-[150px] h-[150px] border-[1px] border-solid border-[#222] rounded-full pointer-events-none grooves"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] bg-[#d4af37] rounded-full flex justify-center items-center text-xs text-[#333]">
              Timeless
            </div>
          </div>
        </div>
        <div
          className="absolute top-[50px] right-12 w-[100px] h-[5px] bg-[#666] transition-transform duration-500"
          style={{
            transformOrigin: "right center",
            transform: isPlaying ? "rotate(-40deg)" : "rotate(-90deg)",
          }}
        ></div>
        <div className="text-center mt-5">
          <button className="py-[10px] px-5 mx-3 my-5 bg-[#d4af37] border-none rounded cursor-pointer text-[#333]">
            <FaBackwardStep />
          </button>
          <button
            className="py-[10px] px-5 mx-3 my-5 bg-[#d4af37] border-none rounded cursor-pointer text-[#333]"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button className="py-[10px] px-5 mx-3 my-5 bg-[#d4af37] border-none rounded cursor-pointer text-[#333]">
            <FaForwardStep />
          </button>
        </div>
      </div>
    </>
  );
};

export default Player;
