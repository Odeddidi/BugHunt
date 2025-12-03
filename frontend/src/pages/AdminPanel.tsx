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
      <div className="p-10 text-2xl font-semibold text-red-600">
        ❌ Access denied — Admins only
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Toolbar */}
      <div className="mb-6 flex gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setView("add_problem")}
        >
          ➕ Add Problem
        </button>

        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setView("home")}
        >
          🏠 Admin Home
        </button>
      </div>

      {/* Views */}
      {view === "home" && (
        <div className="text-xl">
          Welcome, Admin!  
          Use the buttons above to manage the system.
        </div>
      )}

      {view === "add_problem" && <AddProblem />}
    </div>
  );
}
