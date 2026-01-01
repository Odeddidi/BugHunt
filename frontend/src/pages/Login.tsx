import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";


export default function Login({setIsLogged}: {setIsLogged: (val: boolean) => void}) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.detail || "Invalid username or password");
      setLoading(false);
      return;
    }

    const data = await res.json();

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("score", data.score);
    localStorage.setItem("userId", data.user_id);
    localStorage.setItem("isAdmin", data.is_admin);

    alert("Logged in!");
    setIsLogged(true);
    navigate("/home");
  }

  return (
    <div className="min-h-screen relative overflow-hidden text-white px-4 flex items-center justify-center">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/30">
        <div className="flex items-center justify-center gap-3">
          <img src="/oded-2.svg" alt="BugHub Logo" className="h-8 w-8" />
          <span className="text-white font-semibold tracking-wide">BugHub</span>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-center">Welcome Back</h1>
        <p className="mt-2 text-center text-gray-300 text-sm">Log in to continue.</p>

        {error && (
          <div className="mt-5 bg-red-500/10 text-red-200 p-3 rounded-2xl border border-red-500/20 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="text-gray-200 block mb-1">Username</label>
          <input
            type="text"
            className="w-full p-3 mb-4 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="text-gray-200 block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-3 mb-6 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>

        <p className="text-gray-300 mt-5 text-center text-sm">
          Don't have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Create one
          </span>
        </p>

      </div>
    </div>
  );
}
