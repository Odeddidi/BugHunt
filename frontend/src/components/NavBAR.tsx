import { useEffect, useState } from "react";

export default function NavBar() {
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    const u = localStorage.getItem("username");
    const s = localStorage.getItem("score");
    if (u) setUsername(u);
    if (s) setScore(Number(s));
  }, []);

  useEffect(() => {
    const handleScoreUpdate = () => {
      const newScore = localStorage.getItem("score");
      if (newScore) setScore(Number(newScore));
    };

    window.addEventListener("storage-score-updated", handleScoreUpdate);
    return () => window.removeEventListener("storage-score-updated", handleScoreUpdate);
  }, []);

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gray-950/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/oded-2.svg" alt="BugHub Logo" className="h-8 w-8" />
              <span className="text-white font-semibold tracking-wide">BugHunt</span>
            </div>

            <nav className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => (window.location.href = "/home")}
                className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/10 transition"
              >
                Home
              </button>

              <button
                onClick={() => (window.location.href = "/profile")}
                className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/10 transition"
              >
                Profile
              </button>

              {isAdmin && (
                <button
                  onClick={() => (window.location.href = "/admin")}
                  className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-white/10 transition"
                >
                  Admin
                </button>
              )}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-sm text-gray-300">
                <span className="text-white font-semibold">{username}</span>
              </span>
              <span className="h-4 w-px bg-white/10" />
              <span className="text-sm text-gray-300">
                Score: <span className="text-white font-semibold">{score}</span>
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
