import { useEffect, useState } from "react";
import AddProblem from "../components/AddProblem";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<"home" | "add_problem">("home");

  useEffect(() => {
    const flag = localStorage.getItem("isAdmin");
    setIsAdmin(flag === "true");
  }, []);

  if (!isAdmin) {
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
            <div className="text-2xl font-semibold text-red-300">❌ Access denied — Admins only</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Panel</h1>
          <p className="mt-2 text-gray-300">Manage problems and system settings.</p>
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            onClick={() => setView("add_problem")}
          >
            ➕ Add Problem
          </button>

          <button
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition"
            onClick={() => setView("home")}
          >
            🏠 Admin Home
          </button>
        </div>

        {view === "home" && (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <div className="text-xl">Welcome, Admin! Use the buttons above to manage the system.</div>
          </div>
        )}

        {view === "add_problem" && (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <AddProblem />
          </div>
        )}
      </main>
    </div>
  );
}
