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
    <div className="bg-white p-6 border rounded shadow max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Add New Problem</h2>

      {/* TITLE */}
      <input
        className="border p-2 w-full mb-4"
        placeholder="Problem title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* DESCRIPTION */}
      <textarea
        className="border p-2 w-full mb-4"
        placeholder="Problem description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* LANGUAGE */}
      <select
        className="border p-2 w-full mb-4"
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

      {/* DIFFICULTY */}
      <select
        className="border p-2 w-full mb-4"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* BUGGED CODE */}
      <h3 className="font-semibold mb-2">Bugged Code</h3>
      <CodeMirror
        value={bugCode}
        height="200px"
        extensions={[getLanguageExtension(language)]}
        onChange={(v) => setBugCode(v)}
        className="mb-6 border rounded"
      />

      {/* FIXED CODE */}
      <h3 className="font-semibold mb-2">Fixed Code</h3>
      <CodeMirror
        value={fixedCode}
        height="200px"
        extensions={[getLanguageExtension(language)]}
        onChange={(v) => setFixedCode(v)}
        className="mb-6 border rounded"
      />

      {/* TESTS */}
      <h3 className="font-semibold mt-4 mb-2">Tests</h3>

      {tests.map((test, i) => (
        <div key={i} className="flex gap-2 mb-3">
          <textarea
            className="border p-2 flex-1"
            placeholder="Input (optional)"
            value={test.input}
            onChange={(e) => updateTest(i, "input", e.target.value)}
          />

          <input
            className="border p-2 flex-1"
            placeholder="Expected Output"
            value={test.expected_output}
            onChange={(e) => updateTest(i, "expected_output", e.target.value)}
          />

          <button
            className="bg-red-500 text-white px-2 rounded"
            onClick={() => removeTest(i)}
          >
            X
          </button>
        </div>
      ))}

      <button
        className="bg-gray-600 text-white px-3 py-1 rounded mb-6"
        onClick={addTest}
      >
        + Add Test
      </button>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={submit}
      >
        Add Problem
      </button>
    </div>
  );
}
