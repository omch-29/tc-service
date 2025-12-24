"use client";

import { useState } from "react";
import Graph from "@/comp/graph";


export default function TCPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeCode = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:4000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Time Complexity Analyzer
      </h1>

      {/* Language */}
      <label className="block mb-2">Language</label>
      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="mb-4 bg-gray-800 text-white border border-gray-600 p-2 rounded w-40"
      >
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>

      {/* Code */}
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full h-64 bg-gray-800 text-white border border-gray-600 p-4 rounded font-mono placeholder-gray-400"
      />

      {/* Submit */}
      <button
        onClick={analyzeCode}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* Error */}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {/* Result */}
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Time Complexity:
            <span className="ml-2 text-green-400">
              {result.bigO || result.timeComplexity}
            </span>
          </h2>

          {result.graph && <Graph graph={result.graph} />}
        </div>
      )}
    </main>
  );
}