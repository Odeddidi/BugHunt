import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import { useState , useEffect} from "react";
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
const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
const hasToken = !!localStorage.getItem("token");
useEffect(() => {
    const handler = () => {
      setIsLogged(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  

  return (
    <BrowserRouter>

      {!isLogged ? (
        <Routes>
          <Route path="/" element={hasToken ? <Navigate to="/home" /> : <Hero />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setIsLogged={setIsLogged} />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/single" element={<SinglePlayer />} />
            <Route path="/multi-player-lobby" element={<MultiPlayerLobby />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />

          </Routes>
        </>
      )}

    </BrowserRouter>
  );
}
