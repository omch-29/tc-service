// ================== CLEANER ==================
function cleanCode(code) {
  return code
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ");
}

// ================== CORE ANALYZER ==================
function analyzeHeuristic(code) {
  code = cleanCode(code);

  let hasNLoop = false;
  let nLoopCount = 0;
  let hasLogLoop = false;

  // ---------- detect n-loops ----------
  const forNRegex = /for\s*\([^)]*(<|<=)\s*n[^)]*\)/g;
  const forMatches = code.match(forNRegex);
  if (forMatches) {
    hasNLoop = true;
    nLoopCount = forMatches.length;
  }

  // ---------- detect log updates ----------
  const logUpdateRegex = /(\/=\s*2|>>=\s*1|\*=\s*2)/;
  if (logUpdateRegex.test(code)) {
    hasLogLoop = true;
  }

  // ---------- decide complexity ----------
  let parts = [];

  if (hasNLoop) {
    if (nLoopCount === 1) parts.push("n");
    else parts.push(`n^${nLoopCount}`);
  }

  if (hasLogLoop) {
    // if log exists WITH n-loop → n log n
    parts.push("log n");
  }

  const bigO = parts.length ? `O(${parts.join(" * ")})` : "O(1)";

  return {
    bigO,
    bigOmega: bigO,
    bigTheta: bigO.replace("O", "Θ"),
    spaceComplexity: "O(1)",
    confidence: 0.95,
    source: "heuristic"
  };
}

// ================== EXPORTS ==================
function analyzeCPP(code) {
  return analyzeHeuristic(code);
}
function analyzeJava(code) {
  return analyzeHeuristic(code);
}
function analyzePython(code) {
  return analyzeHeuristic(code);
}

module.exports = {
  analyzeCPP,
  analyzeJava,
  analyzePython
};
