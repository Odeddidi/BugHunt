import { useState } from "react";
import { API_URL } from "../config";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await loginUser();
      } else {
        await registerUser();
      }
    } catch (err: any) {
      const message = err.message || "Unknown error";
      alert(message);
      setError(message);
    }

    setLoading(false);
  }

  // REGISTER
  async function registerUser() {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(
        text ||
          "Registration failed — email or username may already exist."
      );
    }

    alert("Registered successfully!");
    setIsLogin(true);
    setPassword("");
  }

  // LOGIN
  async function loginUser() {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(
        text ||
          "Login failed — incorrect username or password."
      );
    }

    const data = JSON.parse(text);

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("score", data.score);
    localStorage.setItem("userId", data.user_id);
    localStorage.setItem("isAdmin", data.is_admin);

    alert("Logged in!");
    window.location.href = "/home";
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/30 text-white">
      <h2 className="text-2xl font-bold text-center">
        {isLogin ? "Login" : "Create Account"}
      </h2>
      <p className="mt-2 text-center text-gray-300 text-sm">
        {isLogin ? "Welcome back." : "Create your account to start playing."}
      </p>

      {error && (
        <div className="mt-5 bg-red-500/10 text-red-200 p-3 rounded-2xl border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <label className="block text-gray-200 mb-1">Username</label>
        <input
          type="text"
          className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {!isLogin && (
          <>
            <label className="block text-gray-200 mb-1 mt-4">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        <label className="block text-gray-200 mb-1 mt-4">Password</label>
        <input
          type="password"
          className="w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
          disabled={loading}
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-300">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className="text-cyan-300 hover:underline cursor-pointer"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
          }}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
}
