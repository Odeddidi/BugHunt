import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";


export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // אם השגיאה היא של Pydantic (422)
      if (data?.detail && Array.isArray(data.detail)) {
        setError(data.detail[0].msg);
      }
      // אם זה שגיאה רגילה שלנו
      else if (data?.detail) {
        setError(data.detail);
      } 
      // fallback
      else {
        setError("Registration failed");
      }

      setLoading(false);
      return;
    }

    alert("Account created successfully!");
    navigate("/login");

  } catch (err) {
    setError("Network error");
    setLoading(false);
  }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden text-white px-4"
    >
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-black/30 border border-white/10">
        <div className="flex items-center justify-center gap-3">
          <img src="/oded-2.svg" alt="BugHub Logo" className="h-8 w-8" />
          <span className="text-white font-semibold tracking-wide">BugHub</span>
        </div>
        
        <h1 className="mt-6 text-3xl font-bold text-center">Create Account</h1>
        <p className="mt-2 text-center text-gray-300 text-sm">Create your account to start playing.</p>

        {error && (
          <div className="mt-5 bg-red-500/10 text-red-200 p-3 rounded-2xl border border-red-500/20 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="text-gray-200 block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 mb-4 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-300 mt-5 text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
