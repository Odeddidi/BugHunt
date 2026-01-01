import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config";

export default function MultiplayerLobby() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 1. FIND MATCH
  async function findMatch() {
    setLoading(true);

    const res = await fetch(`${API_URL}/rooms/find-match`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    navigate(`/room/${data.room_id}`);

  }

  // 2. CREATE PRIVATE ROOM
  async function createPrivateRoom() {
    setLoading(true);

    const res = await fetch(`${API_URL}/rooms/create-private`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    alert(`Share this code: ${data.invite_code}`);
    window.location.href = `/room/${data.room_id}`;
  }

  // 3. JOIN VIA INVITE
  async function joinWithInvite() {
    if (!inviteCode.trim()) return;

    setLoading(true);

    const res = await fetch(
      `${API_URL}/rooms/join-invite?invite_code=${inviteCode}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    window.location.href = `/room/${data.room_id}`;
  }

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/30">
          <h1 className="text-3xl font-bold text-center">Multiplayer Lobby</h1>
          <p className="mt-2 text-center text-gray-300">Find a match or join with an invite code.</p>

          <div className="mt-8 space-y-4">
            <button
              onClick={findMatch}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            >
              🔍 Find Match
            </button>

            <button
              onClick={createPrivateRoom}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition"
            >
              🎮 Create Private Room
            </button>
          </div>

          <div className="mt-8">
            <label className="text-sm text-gray-200">Invite Code</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="mt-2 w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
              placeholder="Enter invite code"
            />

            <button
              onClick={joinWithInvite}
              disabled={loading}
              className="mt-4 w-full py-3 rounded-2xl bg-green-500/90 text-white font-bold hover:bg-green-500 transition shadow-lg shadow-green-500/20"
            >
              ➕ Join with Invite
            </button>
          </div>
        </div>
      </main>
    </div>
);
}
