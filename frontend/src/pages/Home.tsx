import { useNavigate } from "react-router-dom";
import TopPlayers from "../components/TopPlayers";
import { FaBug, FaUsers } from "react-icons/fa";

export default function Home() {
  const username = localStorage.getItem("username");
  const score = localStorage.getItem("score");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-24 px-4">

      {/* TITLE */}
      <h1 className="text-5xl font-extrabold mb-2 text-center leading-tight drop-shadow-lg">
        Welcome back, <span className="text-blue-400">{username}</span>!
      </h1>

      <p className="text-xl text-gray-300 mb-10 text-center max-w-2xl">
        Ready to debug, compete, and win?  
        <br />
        <span className="text-blue-300 font-semibold">Your Score: {score}</span>
      </p>

      {/* BUTTONS */}
      <div className="flex gap-6 mb-14">

        {/* SINGLE PLAYER */}
        <button
          onClick={() => navigate("/single")}
          className="px-8 py-4 flex items-center gap-3 bg-blue-500 hover:bg-blue-600 
                     text-black font-bold rounded-xl text-lg shadow-[0_0_15px_#06b6d4] 
                     transition-all hover:scale-105"
        >
          <FaBug className="text-xl" />
          Single Player
        </button>

        {/* MULTIPLAYER */}
        <button
          onClick={() => navigate("/multi-player-lobby")}
          className="px-8 py-4 flex items-center gap-3 bg-purple-500 hover:bg-purple-600 
                     text-white font-bold rounded-xl text-lg shadow-[0_0_15px_#a855f7] 
                     transition-all hover:scale-105"
        >
          <FaUsers className="text-xl" />
          Multiplayer
        </button>

      </div>

      {/* TOP PLAYERS TABLE */}
      <div className="w-full max-w-4xl mb-10">
        <TopPlayers />
      </div>

    </div>
  );
}
