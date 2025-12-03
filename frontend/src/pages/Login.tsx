import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, WS_URL } from "../config";


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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format')",
        }}
      />

      {/* Dark Overlay + Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-black/40 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 border border-white/10">
        
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h1>

        {error && (
          <div className="mb-4 text-red-400 text-center text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="text-white block mb-1">Username</label>
          <input
            type="text"
            className="w-full p-2 mb-4 rounded bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="text-white block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 mb-6 rounded bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-500 text-white font-bold 
                       shadow-[0_0_10px_#22d3ee] hover:bg-blue-600 transition"
          >
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center text-sm">
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
