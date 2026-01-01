import { useNavigate } from "react-router-dom";
import TopPlayers from "../components/TopPlayers";
import { FaBug, FaUsers } from "react-icons/fa";

export default function Home() {
  const username = localStorage.getItem("username");
  const score = localStorage.getItem("score");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Ready to play
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome back{username ? `, ${username}` : ""}.
          </h1>

          <p className="mt-3 text-gray-300 max-w-2xl">
            Choose a mode and jump in. Your progress is tracked across sessions.
          </p>

          <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-sm text-gray-300">Current score</span>
            <span className="text-lg font-bold text-white">{score ?? "0"}</span>
          </div>
        </header>

        {/* Content grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: actions */}
          <section className="lg:col-span-7 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Single Player Card */}
              <button
                onClick={() => navigate("/single")}
                className="group text-left rounded-3xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-xl shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center">
                    <FaBug className="text-cyan-300 text-xl" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition">Play →</span>
                </div>

                <h2 className="mt-4 text-2xl font-bold">Single Player</h2>
                <p className="mt-2 text-gray-300 leading-relaxed">
                  Practice debugging with instant feedback and build your score.
                </p>

                <div className="mt-4 h-px bg-gradient-to-r from-cyan-400/40 via-white/10 to-transparent" />
                <p className="mt-3 text-sm text-gray-400">Best for warm-ups and improving speed.</p>
              </button>

              {/* Multiplayer Card */}
              <button
                onClick={() => navigate("/multi-player-lobby")}
                className="group text-left rounded-3xl p-6 border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-xl shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-purple-500/15 border border-purple-400/20 flex items-center justify-center">
                    <FaUsers className="text-purple-300 text-xl" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition">Queue →</span>
                </div>

                <h2 className="mt-4 text-2xl font-bold">Multiplayer</h2>
                <p className="mt-2 text-gray-300 leading-relaxed">
                  Real-time rounds against another player. Win rounds to win the match.
                </p>

                <div className="mt-4 h-px bg-gradient-to-r from-purple-400/40 via-white/10 to-transparent" />
                <p className="mt-3 text-sm text-gray-400">Best for competitive play.</p>
              </button>
            </div>

            <div className="rounded-3xl p-6 border border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold">Tip</h3>
              <p className="mt-2 text-gray-300">Keep fixes small and test quickly—speed matters in multiplayer.</p>
            </div>
          </section>

          {/* Right: Top players */}
          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-xl shadow-black/20">
              <TopPlayers />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
