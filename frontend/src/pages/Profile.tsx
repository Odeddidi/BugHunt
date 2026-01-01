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
    return (
      <div className="min-h-screen text-white">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
        <div className="fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h1 className="text-2xl font-bold">You must log in to view your profile.</h1>
          </div>
        </main>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen text-white">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
        <div className="fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-2xl font-semibold animate-pulse">Loading Profile…</div>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Your Profile</h1>
          <p className="mt-2 text-gray-300">Stats, history, and your progress so far.</p>
        </header>

        {/* Personal info */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl shadow-black/20 mb-10">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-gray-300">Username</div>
              <div className="mt-1 text-lg font-semibold text-white">{user.username}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-gray-300">Email</div>
              <div className="mt-1 text-lg font-semibold text-white">{user.email}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm text-gray-300">Score</div>
              <div className="mt-1 text-lg font-semibold text-white">{user.score}</div>
            </div>
          </div>
        </div>

        {/* Seen problems */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Problems You've Seen</h2>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/20">
            <table className="w-full text-left">
              <thead className="bg-white/10">
                <tr className="text-gray-200">
                  <th className="p-3">ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Language</th>
                </tr>
              </thead>
              <tbody>
                {seenProblems.map((p) => (
                  <tr
                    key={p.problem_id}
                    className="border-t border-white/10 hover:bg-white/10 transition"
                  >
                    <td className="p-3">{p.problem_id}</td>
                    <td className="p-3">{p.title}</td>
                    <td className="p-3">{p.language}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Match history */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Match History</h2>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/20">
            <table className="w-full text-left">
              <thead className="bg-white/10">
                <tr className="text-gray-200">
                  <th className="p-3">Opponent</th>
                  <th className="p-3">Result</th>
                  <th className="p-3">Rounds Won</th>
                  <th className="p-3">Rounds Lost</th>
                  <th className="p-3">Room</th>
                </tr>
              </thead>

              <tbody>
                {matches.map((m, i) => (
                  <tr
                    key={i}
                    className="border-t border-white/10 hover:bg-white/10 transition"
                  >
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
        </section>
      </main>
    </div>
);

}
