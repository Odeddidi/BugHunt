import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";

import { API_URL } from "../config";
export default function SinglePlayer() {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [problem, setProblem] = useState<any>(null);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [runningTests, setRunningTests] = useState(false);


  const token = localStorage.getItem("token");

  // Fetch problem by difficulty
  useEffect(() => {
    if (!difficulty) return;
    setLoadingProblem(true);

    const url =
      difficulty === "random"
        ? `${API_URL}/problems`
        : `${API_URL}/problems?difficulty=${difficulty}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setProblem(data);
        setUserCode("");
        setFeedback(null);
      })
      .finally(() => setLoadingProblem(false));
  }, [difficulty]);

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

  // Submitting a solution
  async function submitSolution() {
    if (!problem) return;
    setRunningTests(true);
    setFeedback(null);


    const res = await fetch(`${API_URL}/problems/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        problem_id: problem.id,
        solution: userCode,
      }),
    });

    const data = await res.json();
    setRunningTests(false);

    if (data.correct) {
      setFeedback("✔ Correct! Score updated.");

      const currentScore = Number(localStorage.getItem("score") || "0");
      localStorage.setItem("score", String(currentScore + 1));
    } else {
      setFeedback("❌ Incorrect. Try again!");
    }
  }

  // Load next problem
  function loadNextProblem() {
    setProblem(null);
    setFeedback(null);

    const url =
      difficulty === "random"
        ? `${API_URL}/problems`
        : `${API_URL}/problems?difficulty=${difficulty}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        setProblem(data);
        setUserCode("");
      });
  }

  // ----------------------------
  // PAGE 1 — Difficulty Selection
  // ----------------------------
  if (!difficulty) {
    return (
      <div className="min-h-screen text-white">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
        <div className="fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <main className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/30 text-center">
            <h2 className="text-3xl font-bold">Choose Difficulty</h2>
            <p className="mt-2 text-gray-300">Pick a challenge level to start.</p>

            <div className="mt-8 space-y-3">
              {["easy", "medium", "hard", "random"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className="w-full py-3 rounded-2xl font-semibold bg-white/10 border border-white/15 hover:bg-white/15 transition"
                >
                  {diff.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------
  // PAGE 2 — Loading
  // ----------------------------
  if (loadingProblem || !problem) {
    return (
      <div className="min-h-screen text-white">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
        <div className="fixed inset-0 -z-10 opacity-60">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <main className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center">
          <h1 className="text-3xl font-bold animate-pulse">Loading problem...</h1>
        </main>
      </div>
    );
  }

  // ----------------------------
  // PAGE 3 — Main Game Screen
  // ----------------------------
  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900" />
      <div className="fixed inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 -right-24 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">{problem.title}</h1>
          <p className="mt-3 text-gray-300 max-w-4xl">{problem.description}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
            <h3 className="text-xl font-bold mb-3">Bugged Code</h3>
            <CodeMirror
              value={problem.code_with_bug}
              height="350px"
              theme="dark"
              readOnly={true}
              extensions={[getLanguageExtension(problem.language)]}
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
            <h3 className="text-xl font-bold mb-3">Your Fix</h3>
            <CodeMirror
              value={userCode}
              height="350px"
              theme="dark"
              extensions={[problem.language === "python" ? python() : javascript()]}
              onChange={(val) => setUserCode(val)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={submitSolution}
            className="px-8 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
          >
            Submit
          </button>

          {feedback && <p className="text-xl font-semibold">{feedback}</p>}

          {runningTests && (
            <div className="text-lg font-semibold animate-pulse text-cyan-300">Running Tests...</div>
          )}
        </div>

        {feedback === "✔ Correct! Score updated." && (
          <button
            onClick={loadNextProblem}
            className="mt-6 px-8 py-3 rounded-2xl font-bold bg-green-500/90 hover:bg-green-500 transition shadow-lg shadow-green-500/20"
          >
            Next Problem
          </button>
        )}
      </main>
    </div>
  );
}
