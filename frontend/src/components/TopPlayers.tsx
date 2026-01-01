import { useEffect, useState } from "react";
import { API_URL } from "../config";


export default function TopPlayers() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users/top10`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Failed loading top players:", err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
        🏆 Top 10 Players
      </h2>
      <p className="mt-2 text-gray-300 text-sm">Live leaderboard.</p>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full">
          <thead className="bg-white/5">
            <tr className="text-gray-200 border-b border-white/10">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Score</th>
            </tr>
          </thead>

          <tbody>
            {players.map((p: any, index: number) => (
              <tr key={p.username} className="border-b border-white/10 hover:bg-white/10 transition">
                <td className="py-3 px-4 text-white font-semibold">{index + 1}</td>
                <td className="py-3 px-4 text-white">{p.username}</td>
                <td className="py-3 px-4 text-white">{p.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
