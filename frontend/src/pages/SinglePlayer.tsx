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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-96 border border-white/10 text-center">

          <h2 className="text-3xl font-bold mb-8">Choose Difficulty</h2>

          {["easy", "medium", "hard", "random"].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className="w-full py-3 mb-4 rounded-lg font-semibold 
                         bg-gradient-to-r from-blue-600 to-purple-600
                         hover:opacity-90 transition shadow-lg"
            >
              {diff.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------
  // PAGE 2 — Loading
  // ----------------------------
  if (loadingProblem || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
        <h1 className="text-3xl font-bold animate-pulse">Loading problem...</h1>
      </div>
    );
  }

  // ----------------------------
  // PAGE 3 — Main Game Screen
  // ----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-10 flex flex-col items-center">

      <h1 className="text-4xl font-extrabold mb-8 drop-shadow-lg">{problem.title}</h1>
      <p className="text-gray-300 mb-8 max-w-4xl">{problem.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">

        {/* LEFT — Bugged Code */}
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-xl">
          <h3 className="text-xl font-bold mb-3">Bugged Code</h3>

          <CodeMirror
            value={problem.code_with_bug}
            height="350px"
            theme="dark"
            readOnly={true}
            extensions={[getLanguageExtension(problem.language)]}

          />    
        </div>

        {/* RIGHT — Your Fix */}
        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-xl">
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

      {/* Submit */}
      <button
        onClick={submitSolution}
        className="mt-6 px-10 py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 transition shadow-xl"
      >
        Submit
      </button>

      {/* Feedback */}
      {feedback && (
        <p className="mt-4 text-2xl font-semibold">
          {feedback}
        </p>
      )}
      {runningTests && (
        <div className="mt-4 text-xl font-semibold animate-pulse text-blue-400">
             Running Tests...
        </div>
        )}


      {/* Next Problem */}
      {feedback === "✔ Correct! Score updated." && (
        <button
          onClick={loadNextProblem}
          className="mt-5 px-8 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 transition shadow-xl"
        >
          Next Problem
        </button>
      )}
    </div>
  );
}
