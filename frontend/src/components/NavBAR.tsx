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

    return () => {
      window.removeEventListener("storage-score-updated", handleScoreUpdate);
    };
  }, []);


  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login";
  }

 return (
  <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">

    {/* LEFT SIDE — EXACT SAME DESIGN */}
    <div className="text-lg font-semibold flex items-center">
      <img src="/oded-2.svg" alt="BugHub Logo" className="h-8 w-8" />
      
      <span
        onClick={() => (window.location.href = "/home")}
        className="ml-4 cursor-pointer text-gray-700 hover:text-blue-600 transition"
      >
        Home
      </span>

      <span
        onClick={() => (window.location.href = "/profile")}
        className="ml-4 cursor-pointer text-gray-700 hover:text-blue-600 transition"
      >
        Profile
      </span>

      {isAdmin && (
        <span
          onClick={() => (window.location.href = "/admin")}
          className="ml-4 cursor-pointer text-gray-700 hover:text-blue-600 transition"
        >
          Admin Panel
        </span>
      )}
    </div>

    {/* RIGHT SIDE — SAME STYLE AS BEFORE */}
    <div className="flex items-center">
      <span className="text-blue-600">{username}</span>
      <span className="ml-4 text-gray-700">Score: {score}</span>

      <button
        onClick={handleLogout}
        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Logout
      </button>
    </div>

  </nav>
);

}
