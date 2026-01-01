import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import SinglePlayer from "./pages/SinglePlayer";
import Navbar from "./components/NavBAR";
import MultiPlayerLobby from "./pages/MultiplayerLobby";
import Room from "./pages/Room";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import Hero from "./pages/Hero";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

export default function App() {
  const [isLogged, setIsLogged] = useState(() => !!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      {isLogged ? (
        <>
          <Navbar />
          <Routes>
            {/* typing "/" while logged in -> go home */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/home" element={<Home />} />
            <Route path="/single" element={<SinglePlayer />} />
            <Route path="/multi-player-lobby" element={<MultiPlayerLobby />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setIsLogged={setIsLogged} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}