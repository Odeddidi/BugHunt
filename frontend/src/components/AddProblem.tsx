import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
interface TestCase {
  input: string;
  expected_output: string;
}

export default function AddProblem() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [bugCode, setBugCode] = useState<string>("");
  const [fixedCode, setFixedCode] = useState<string>("");

  const [tests, setTests] = useState<TestCase[]>([
    { input: "", expected_output: "" },
  ]);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  function getLanguageExtension(lang: string) {
    switch (lang) {
      case "python":
        return python();
      case "javascript":
        return javascript();
      case "typescript":
        return javascript({ typescript: true });
      
      case "cpp":
        return cpp();
      case "java":
        return java();
      default:
        return javascript();
    }
  }

  const addTest = () => {
    setTests([...tests, { input: "", expected_output: "" }]);
  };

  const removeTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const updateTest = (index: number, field: keyof TestCase, value: string) => {
    const updated = [...tests];
    updated[index][field] = value;
    setTests(updated);
  };

  async function submit() {
    const payload = {
      title,
      description,
      language,
      difficulty,
      code_with_bug: bugCode,
      fixed_code: fixedCode,
      tests: tests,
    };

    const res = await fetch(`${API}/problems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.msg || "Problem added!");

    setTitle("");
    setBugCode("");
    setFixedCode("");
    setTests([{ input: "", expected_output: "" }]);
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-semibold text-white">Add New Problem</h2>
      <p className="mt-2 text-gray-300">Create a new challenge for players.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-200">Title</label>
          <input
            className="mt-2 w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            placeholder="Problem title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-200">Description</label>
          <textarea
            className="mt-2 w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none min-h-[120px]"
            placeholder="Problem description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-200">Language</label>
          <select
            className="mt-2 w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-200">Difficulty</label>
          <select
            className="mt-2 w-full p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <h3 className="font-semibold text-white mb-2">Bugged Code</h3>
          <CodeMirror
            value={bugCode}
            height="220px"
            theme="dark"
            extensions={[getLanguageExtension(language)]}
            onChange={(v) => setBugCode(v)}
            className="overflow-hidden rounded-2xl border border-white/10"
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <h3 className="font-semibold text-white mb-2">Fixed Code</h3>
          <CodeMirror
            value={fixedCode}
            height="220px"
            theme="dark"
            extensions={[getLanguageExtension(language)]}
            onChange={(v) => setFixedCode(v)}
            className="overflow-hidden rounded-2xl border border-white/10"
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-white">Tests</h3>
        <p className="mt-1 text-sm text-gray-300">Add input/output cases used for validation.</p>

        <div className="mt-4 space-y-3">
          {tests.map((test, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-3">
              <textarea
                className="p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none flex-1 min-h-[52px]"
                placeholder="Input (optional)"
                value={test.input}
                onChange={(e) => updateTest(i, "input", e.target.value)}
              />

              <input
                className="p-3 rounded-2xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 outline-none flex-1"
                placeholder="Expected Output"
                value={test.expected_output}
                onChange={(e) => updateTest(i, "expected_output", e.target.value)}
              />

              <button
                className="px-4 py-3 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition"
                onClick={() => removeTest(i)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15 transition"
            onClick={addTest}
          >
            + Add Test
          </button>

          <button
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            onClick={submit}
          >
            Add Problem
          </button>
        </div>
      </div>
    </div>
  );
}
