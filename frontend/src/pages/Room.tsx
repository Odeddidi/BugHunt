import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import {  WS_URL } from "../config";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const wsRef = useRef<WebSocket | null>(null);

  const [wsConnected, setWsConnected] = useState(false);
  const [opponent, setOpponent] = useState<string | null>(null);

  const [problem, setProblem] = useState<any>(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctSolution, setCorrectSolution] = useState<string | null>(null);
  const [nextRoundReady, setNextRoundReady] = useState(false);
  const [scores, setScores] = useState({me: 0,opponent: 0,});
  const username = localStorage.getItem("username");
  const [isRunning, setIsRunning] = useState(false);

  const [roundKey, setRoundKey] = useState(0);

  function getLanguageExtension(lang: string) {
  switch (lang) {
    case "python": return python();
    case "javascript": return javascript();
    case "cpp": return cpp();
    case "c": return cpp();       // cpp handles C fine
    case "java": return java();
    default: return javascript();
  }
}

  // Reset UI on new round
  function resetRound(problemObj: any) {
    setProblem(problemObj);
    setUserCode("");
    setFeedback(null);
    setCorrectSolution(null);
    setNextRoundReady(false);
    setRoundKey((prev) => prev + 1);
  }

  // ------------------------------------------------------------------
  // WebSocket connection
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!roomId) return;
    if (wsRef.current) return;

    const ws = new WebSocket(`${WS_URL}/rooms/${roomId}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      switch (data.event) {
        case "opponent_join":
          console.log("Opponent joined:", data.username);
          setOpponent(data.username);
          break;

        case "round_start":
          resetRound(data.problem);
          break;

        case "solution_result":
          setIsRunning(false);
        if (data.correct) {
          setFeedback(`✔ Winner: ${data.winner_name}`);
          setCorrectSolution(data.fixed_code);
          setNextRoundReady(true);

          setScores((prev) => {
            if (data.winner_name === username) {
              return { ...prev, me: prev.me + 1 };
            } else {
              return { ...prev, opponent: prev.opponent + 1 };
            }
          });

        } else {
          setFeedback("❌ Incorrect fix");
        }
        break;


        case "next_round_wait":
          setFeedback("⏳ Waiting for opponent...");
          setNextRoundReady(false);
          break;

        case "next_round_request":
          const approve = window.confirm(
            `${data.from_user} wants to start next round. Accept?`
          );
          if (approve) {
            wsRef.current?.send(
              JSON.stringify({ event: "next_round_accept" })
            );
          } else {
            wsRef.current?.send(
              JSON.stringify({ event: "next_round_decline" })
            );
          }
          break;

        case "opponent_declined":
          setFeedback("❌ Opponent declined next round.");
          setNextRoundReady(false);
          break;



        case "you_declined_and_left":
          alert("You declined next round. Leaving room.");
          navigate("/home");
          break;

        case "opponent_left":
          alert("Opponent left the game.");
          navigate("/home");
          break;

        case "room_result":
          console.log("ROOM RESULT RECEIVED", data);
          const winner = data.winner_name;

          if (winner === null) {
            alert("Game ended in a draw.");
          } else {
            if (winner == username){
              localStorage.setItem("score", String(Number(localStorage.getItem("score") || "0") + 1));
              window.dispatchEvent(new Event("storage-score-updated"));
              
            }
            
            alert(`Game Over! Winner: ${winner}`);
            
          }

          navigate("/home");
          break;

        case "room_closed":
          alert("Room was closed.");
          navigate("/home");
          break;

        default:
          console.log("Unknown event:", data);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [roomId, token]);

  // ------------------------------------------------------------------
  // SEND EVENTS
  // ------------------------------------------------------------------
  function submitSolution() {
    if (!problem) return;
    setIsRunning(true);
    wsRef.current?.send(
      JSON.stringify({
        event: "submit_solution",
        problem_id: problem.id,
        solution: userCode,
      })
    );
  }

  function requestNextRound() {
    wsRef.current?.send(JSON.stringify({ event: "next_round_request" }));
    wsRef.current?.send(JSON.stringify({ event: "next_round_accept" }));

    setFeedback("⏳ Waiting for opponent...");
    setNextRoundReady(false);
  }

  function leaveGame() {
    wsRef.current?.send(
        JSON.stringify({ event: "exit_room" })
    );  }

  // ------------------------------------------------------------------
  // LOADING UI
  // ------------------------------------------------------------------

  
  if (!wsConnected)
    return (
      <div className="min-h-screen text-white">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
        <div className="fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <main className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center">
          <h1 className="text-4xl font-bold animate-pulse">Connecting…</h1>
        </main>
      </div>
    );

  if (!opponent)
    return (
      <div className="min-h-screen text-white">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
        <div className="fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <main className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center">
          <h1 className="text-4xl font-bold animate-pulse">Waiting for opponent…</h1>
        </main>
      </div>
    );

  if (!problem)
    return (
      <div className="min-h-screen text-white">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
        <div className="fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>
        <main className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center">
          <h1 className="text-4xl font-bold animate-pulse">Loading problem…</h1>
        </main>
      </div>
    );
  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-extrabold tracking-wide drop-shadow break-words">
            {problem.title}
          </h1>
          <div className="mt-1 max-h-28 overflow-auto pr-2">
            <p className="text-gray-300 whitespace-pre-wrap break-words">
              {problem.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          {/* SCOREBOARD */}
          <div className="flex flex-col sm:flex-row gap-3 text-xl font-bold">
            <span className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur shadow-md">
              {username}: <span className="text-green-400">{scores.me}</span>
            </span>
            <span className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur shadow-md">
              {opponent}: <span className="text-red-400">{scores.opponent}</span>
            </span>
          </div>

          {/* LEAVE BUTTON */}
          <button
            onClick={leaveGame}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg shadow-lg"
          >
            Leave
          </button>
        </div>
      </div>

      {/* CODE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* BUG CODE */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
          <h2 className="text-lg font-bold mb-3">Bugged Code</h2>
          <CodeMirror
            key={`bug-${roundKey}`}
            value={problem.code_with_bug}
            readOnly
            height="350px"
            theme="dark"
            extensions={[getLanguageExtension(problem.language)]}
          />
        </div>

        {/* USER FIX */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
          <h2 className="text-lg font-bold mb-3">Your Fix</h2>
          <CodeMirror
            key={`fix-${roundKey}`}
            value={userCode}
            height="350px"
            theme="dark"
            onChange={(v) => setUserCode(v)}
            extensions={[problem.language === "python" ? python() : javascript()]}
          />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={submitSolution}
        disabled={isRunning}
        className={`mt-8 px-10 py-3 rounded-lg font-bold text-lg shadow-lg transition 
          ${isRunning ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`
        }
      >
        {isRunning ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Running tests…
          </div>
        ) : (
          "Submit"
        )}
      </button>


      {/* FEEDBACK */}
      {feedback && (
        <p className="mt-6 text-2xl font-semibold text-center">{feedback}</p>
      )}

      {/* CORRECT SOLUTION */}
      {correctSolution && (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
          <h2 className="text-xl font-bold mb-3">⭐ Correct Solution</h2>
          <CodeMirror
            key={`solution-${roundKey}`}
            value={correctSolution}
            readOnly
            height="200px"
            theme="dark"
            extensions={[problem.language === "python" ? python() : javascript()]}
          />
        </div>
      )}

      {/* NEXT ROUND BUTTON */}
      {nextRoundReady && (
        <div className="flex justify-center mt-8">
          <button
            onClick={requestNextRound}
            className="px-10 py-3 bg-green-500/90 rounded-2xl font-bold text-lg shadow-lg shadow-green-500/20 hover:bg-green-500 transition"
          >
            Next Round
          </button>
        </div>
      )}
      </main>
    </div>
  );

}
