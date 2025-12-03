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
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* רקע מטושטש כמו ב-Hero */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format')",
        }}
      />

      {/* שכבת השחרה + טשטוש */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* תוכן */}
      <div className="relative bg-black/40 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 border border-white/10">
        
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 text-red-400 text-center text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="text-white block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 mb-4 rounded bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

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
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
