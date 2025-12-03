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
  <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 
                  flex items-center justify-center text-white px-4">

    {/* CARD */}
    <div className="bg-gray-800/60 backdrop-blur-xl p-10 w-[420px] rounded-2xl 
                    shadow-2xl border border-white/10">

      <h1 className="text-3xl font-bold text-center mb-8">
        Multiplayer Lobby
      </h1>

      {/* FIND MATCH */}
      <button
        onClick={findMatch}
        disabled={loading}
        className="w-full py-3 mb-5 rounded-lg bg-blue-500 text-white font-semibold 
                   shadow-[0_0_15px_#3b82f6] hover:bg-blue-600 transition"
      >
        🔍 Find Match
      </button>

      {/* CREATE PRIVATE ROOM */}
      <button
        onClick={createPrivateRoom}
        disabled={loading}
        className="w-full py-3 mb-6 rounded-lg bg-purple-500 text-white font-semibold 
                   shadow-[0_0_15px_#a855f7] hover:bg-purple-600 transition"
      >
        🎮 Create Private Room
      </button>

      <label className="text-white text-sm">Invite Code</label>

      <input
        type="text"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="w-full p-3 rounded-lg bg-white/10 text-white border 
                   border-white/20 mb-4 focus:border-blue-400 outline-none"
        placeholder="Enter invite code"
      />

      {/* JOIN */}
      <button
        onClick={joinWithInvite}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-green-500 text-white font-bold
                   shadow-[0_0_15px_#4ade80] hover:bg-green-600 transition"
      >
        ➕ Join with Invite
      </button>

    </div>
  </div>
);
}
