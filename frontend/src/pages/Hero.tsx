import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1600&auto=format')",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900/80 to-purple-950/40" />

      {/* Glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Real-time debugging arena
            </div>

            <h1 className="mt-5 text-5xl md:text-6xl font-extrabold tracking-tight">
              Debug faster.
              <br />
              Win smarter.
            </h1>

            <p className="mt-5 text-lg text-gray-300 max-w-xl leading-relaxed">
              Fix broken code, race opponents, and climb the leaderboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="px-7 py-3 rounded-2xl bg-white text-gray-950 font-semibold hover:bg-gray-100 transition shadow-xl shadow-black/30"
              >
                Create account
              </Link>

              <Link
                to="/login"
                className="px-7 py-3 rounded-2xl font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15 transition"
              >
                Log in
              </Link>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-gray-300">Mode</div>
                <div className="mt-1 font-semibold">Single Player</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-gray-300">Mode</div>
                <div className="mt-1 font-semibold">Multiplayer</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-gray-300">Goal</div>
                <div className="mt-1 font-semibold">Leaderboard</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
              <h2 className="text-xl font-semibold">What you get</h2>
              <ul className="mt-4 space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-cyan-300">•</span>
                  Fast rounds with instant feedback
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-300">•</span>
                  Competitive pacing without UI clutter
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-300">•</span>
                  Dark-mode-first visuals designed for code
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
