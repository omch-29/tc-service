const { analyze } = require("../services/astAnalyzer");
const { generateGraph } = require("../utils/graphGenerator");
const { analyzeWithAI } = require("../services/aiAnalyzer");

// Conservative comparison so we NEVER underestimate
function maxComplexity(a, b) {
  const order = [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n log n)",
    "O(n^2)",
    "O(n^3)",
    "O(2^n)"
  ];
  return order.indexOf(a) > order.indexOf(b) ? a : b;
}

exports.analyzeCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }
  if (!language) {
    return res.status(400).json({ error: "Language is required" });
  }

  let result;
  try {
    // 🔹 Use generic analyzer for all languages
    result = analyze(code, language.toLowerCase());
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  let finalResult = {
    ...result,
    source: "rule-based"
  };

  // 🔥 AI fallback if confidence < 0.7
  if (typeof result.confidence === "number" && result.confidence < 0.7) {
    const aiResult = await analyzeWithAI(code);

    finalResult = {
      timeComplexity: maxComplexity(
        result.timeComplexity,
        aiResult.timeComplexity
      ),
      spaceComplexity: maxComplexity(
        result.spaceComplexity,
        aiResult.spaceComplexity
      ),
      explanation: [
        ...result.explanation,
        ...aiResult.explanation
      ],
      confidence: Math.max(result.confidence, aiResult.confidence),
      source: "rule-based + ai"
    };
  }

  // Generate visualization
  const graph = generateGraph(finalResult.timeComplexity);

  res.json({
    ...finalResult,
    graph
  });
};
