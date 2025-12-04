import { useEffect, useState } from "react";
import { API_URL, WS_URL } from "../config";


export default function TopPlayers() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users/top10`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Failed loading top players:", err));
  }, []);

  return (
    <div className="bg-[#1e293b]/60 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md">

      <h2 className="text-3xl mb-6 font-bold text-white flex items-center gap-3">
        🏆 Top 10 Players
      </h2>

      <table className="min-w-full">
        <thead>
          <tr className="text-gray-300 border-b border-white/10">
            <th className="py-3 text-left">Rank</th>
            <th className="py-3 text-left">Username</th>
            <th className="py-3 text-left">Score</th>
          </tr>
        </thead>

        <tbody>
          {players.map((p: any, index: number) => (
            <tr
              key={p.username}
              className="border-b border-white/10 hover:bg-white/10 transition"
            >
              <td className="py-3 text-white font-semibold">{index + 1}</td>
              <td className="py-3 text-white">{p.username}</td>
              <td className="py-3 text-white">{p.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
