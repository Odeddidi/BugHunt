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
    <div className="bg-white w-96 p-8 rounded-xl shadow-lg">

      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Login" : "Create Account"}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Username */}
        <label className="block text-gray-700 mb-1">Username</label>
        <input
          type="text"
          className="border w-full p-2 rounded mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email - register only */}
        {!isLogin && (
          <>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="border w-full p-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}

        {/* Password */}
        <label className="block text-gray-700 mb-1">Password</label>
        <input
          type="password"
          className="border w-full p-2 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      {/* Toggle */}
      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className="text-blue-600 hover:underline cursor-pointer"
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
