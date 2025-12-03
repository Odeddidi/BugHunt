import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden text-white">

      {/* רקע */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format')"
        }}
      />

      {/* Gradient עליון */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/40" />

      {/* תוכן */}
      <div className="relative h-full flex flex-col justify-center px-16">
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-xl">
          DEBUG SHOWDOWN
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Fix. Compete. Conquer. Real-time coding battles.
        </p>

        <div className="flex gap-4">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-lg font-semibold shadow-lg shadow-blue-500/50"
          >
            SIGN UP
          </Link>

          <Link
            to="/login"
            className="px-8 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-lg font-semibold shadow-lg shadow-purple-500/50"
          >
            LOG IN
          </Link>
        </div>
      </div>

      {/* אייקונים (אופציונלי) */}
      <div className="absolute right-16 top-1/3 flex flex-col gap-10">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border flex items-center justify-center text-2xl">⚔️</div>
          <p className="mt-2 text-gray-300 text-sm">REAL-TIME ARENA</p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 rounded-full border flex items-center justify-center text-2xl">🧩</div>
          <p className="mt-2 text-gray-300 text-sm">PRACTICE MODE</p>
        </div>
      </div>

    </div>
  );
}
