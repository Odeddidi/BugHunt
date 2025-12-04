import { useEffect, useState } from "react";
import { API_URL } from "../config";


interface SeenProblem {
  problem_id: number;
  title: string;
  language: string;
}

interface MatchHistory {
  opponent: string;
  winner: boolean | null;   // true = win, false = loss, null = draw
  rounds_won: number;
  rounds_lost: number;
  room_id: number;
}

export default function Profile() {
  const userId = localStorage.getItem("userId");

  const [seenProblems, setSeenProblems] = useState<SeenProblem[]>([]);
  const [matches, setMatches] = useState<MatchHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      try {
        const [problemsRes, matchesRes, userRes] = await Promise.all([
          fetch(`${API_URL}/users/${userId}/seen_problems`),
          fetch(`${API_URL}/users/${userId}/matches`),
          fetch(`${API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })

        ]);

        if (problemsRes.ok) {
          const problems = await problemsRes.json();
          setSeenProblems(problems);
        }

        if (matchesRes.ok) {
          const ms = await matchesRes.json();
          setMatches(ms);
        }
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  if (!userId)
    return <h1 className="p-10 text-xl">You must log in to view your profile.</h1>;

  if (loading)
    return (
      <div className="p-10 text-2xl font-semibold animate-pulse">
        Loading Profile…
      </div>
    );

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10">

    {/* PAGE TITLE */}
    <h1 className="text-4xl font-extrabold mb-10 drop-shadow">Your Profile</h1>

    {/* PERSONAL INFO CARD */}
    <div className="bg-white/10 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl max-w-2xl mb-12">
      <h2 className="text-2xl font-bold mb-4">👤 Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
        <p><span className="font-semibold text-blue-300">Username:</span> {user.username}</p>
        <p><span className="font-semibold text-blue-300">Email:</span> {user.email}</p> 
        <p><span className="font-semibold text-blue-300">Score:</span> {user.score}</p>
      </div>
    </div>

    {/* SEEN PROBLEMS */}
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-4">Problems You've Seen</h2>

      <div className="overflow-hidden rounded-2xl shadow-xl border border-white/10 bg-white/5 backdrop-blur">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Language</th>
            </tr>
          </thead>
          <tbody>
            {seenProblems.map((p) => (
              <tr key={p.problem_id} className="border-t border-white/10 hover:bg-white/10 transition">
                <td className="p-3">{p.problem_id}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.language}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* MATCH HISTORY */}
    <div>
      <h2 className="text-3xl font-bold mb-4">Match History</h2>

      <div className="overflow-hidden rounded-2xl shadow-xl border border-white/10 bg-white/5 backdrop-blur">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="p-3">Opponent</th>
              <th className="p-3">Result</th>
              <th className="p-3">Rounds Won</th>
              <th className="p-3">Rounds Lost</th>
              <th className="p-3">Room</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((m, i) => (
              <tr key={i} className="border-t border-white/10 hover:bg-white/10 transition">
                <td className="p-3">{m.opponent}</td>
                <td className="p-3">
                  {m.winner === true
                    ? "Win"
                    : m.rounds_won === m.rounds_lost
                    ? "Draw"
                    : "Loss"}
                </td>
                <td className="p-3">{m.rounds_won}</td>
                <td className="p-3">{m.rounds_lost}</td>
                <td className="p-3">{m.room_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

}
