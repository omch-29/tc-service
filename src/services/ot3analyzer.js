// ================== HELPERS ==================
const complexityOrder = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n^2)",
  "O(n^3)",
  "O(n^4)",
  "O(2^n)"
];

function thetaIfPossible(o, omega) {
  return o === omega ? o.replace("O", "Θ") : null;
}

// ================== NORMALIZE ==================
function normalize(code) {
  return code
    .replace(/\r/g, "")
    .replace(/{/g, "{\n")
    .replace(/}/g, "\n}\n")
    .replace(/;/g, ";\n");
}

// ================== LOOP ANALYZER ==================
// function analyzeLoops(code) {
//   code = normalize(code);
//   const lines = code.split("\n").map(l => l.trim()).filter(Boolean);

//   let stack = [];
//   let maxN = 0;
//   let maxLog = 0;

//   for (const line of lines) {

//     // ---- O(n) for-loop ----
//     if (/for\s*\(.*<\s*n/.test(line)) {
//       stack.push("n");
//     }

//     // ---- O(log n) while-loop ----
//     else if (
//       /while\s*\(.*\)/.test(line) &&
//       /(\/=|>>=|\/\s*2)/.test(line)
//     ) {
//       stack.push("log");
//     }

//     // ---- Block end ----
//     else if (line === "}") {
//       stack.pop();
//     }

//     // ---- Update max depth ----
//     const nCount = stack.filter(x => x === "n").length;
//     const logCount = stack.filter(x => x === "log").length;

//     maxN = Math.max(maxN, nCount);
//     maxLog = Math.max(maxLog, logCount);
//   }

//   // ---- Build Big-O ----
//   if (maxN === 0 && maxLog === 0) return "O(1)";

//   let parts = [];
//   if (maxN === 1) parts.push("n");
//   else if (maxN > 1) parts.push(`n^${maxN}`);

//   if (maxLog > 0) parts.push("log n");

//   return `O(${parts.join(" * ")})`;
// }



function analyzeLoops(code) {
  code = code.replace(/\r/g, "").replace(/{/g, "{\n").replace(/}/g, "\n}\n");
  const lines = code.split("\n").map(l => l.trim()).filter(Boolean);

  let stack = [];
  let maxComplexity = { n: 0, log: 0 };
  let depth = 0;

  for (const line of lines) {
    if (line.includes("{")) depth++;
    if (line.includes("}")) depth--;

    // Detect O(n) for-loops
    if (/for\s*\(.*<\s*n.*\)/.test(line)) {
      stack.push({ type: "n", depth });
    }

    // Detect O(log n) while-loops
    else if (/while\s*\(.*\)/.test(line) && /(\/=|>>|\/\s*2)/.test(line)) {
      stack.push({ type: "log", depth });
    }

    // Pop loops that ended
    stack = stack.filter(x => x.depth <= depth);

    // Count multiplicative nesting
    const nCount = stack.filter(x => x.type === "n").length;
    const logCount = stack.filter(x => x.type === "log").length;
    if (nCount > 0 && logCount > 0) {
      maxComplexity.n = Math.max(maxComplexity.n, nCount);
      maxComplexity.log = Math.max(maxComplexity.log, logCount);
    } else if (nCount > 0) {
      maxComplexity.n = Math.max(maxComplexity.n, nCount);
    } else if (logCount > 0) {
      maxComplexity.log = Math.max(maxComplexity.log, logCount);
    }
  }

  if (maxComplexity.n === 0 && maxComplexity.log === 0) return "O(1)";

  let parts = [];
  if (maxComplexity.n > 0) parts.push(maxComplexity.n === 1 ? "n" : `n^${maxComplexity.n}`);
  if (maxComplexity.log > 0) parts.push("log n");

  return `O(${parts.join(" * ")})`;
}








// function analyzeLoops(code) {
//   // Only normalize braces, not semicolons
//   code = code.replace(/\r/g, "").replace(/{/g, "{\n").replace(/}/g, "\n}\n");

//   const lines = code.split("\n").map(l => l.trim()).filter(Boolean);

//   let stack = [];
//   let maxN = 0;
//   let maxLog = 0;
//   let depth = 0;

//   for (const line of lines) {
//     if (line.includes("{")) depth++;
//     if (line.includes("}")) depth--;

//     // Detect O(n) for-loops
//     if (/for\s*\(.*<\s*n.*\)/.test(line)) {
//       stack.push({ type: "n", depth });
//     }
//     // Detect O(log n) while-loops
//     else if (/while\s*\(.*\)/.test(line) && /(\/=|>>|\/\s*2)/.test(line)) {
//       stack.push({ type: "log", depth });
//     }

//     // Pop loops that ended
//     stack = stack.filter(x => x.depth <= depth);

//     const nCount = stack.filter(x => x.type === "n").length;
//     const logCount = stack.filter(x => x.type === "log").length;

//     maxN = Math.max(maxN, nCount);
//     maxLog = Math.max(maxLog, logCount);
//   }

//   if (maxN === 0 && maxLog === 0) return "O(1)";

//   let parts = [];
//   if (maxN > 0) parts.push(maxN === 1 ? "n" : `n^${maxN}`);
//   if (maxLog > 0) parts.push("log n");

//   return `O(${parts.join(" * ")})`;
// }

// ================== MAIN ANALYZER ==================
function analyzeCode(code) {
  const bigO = analyzeLoops(code);
  const bigOmega = bigO;           // loops always execute fully
  const bigTheta = thetaIfPossible(bigO, bigOmega);

  return {
    bigO,
    bigOmega,
    bigTheta,
    spaceComplexity: "O(1)",
    explanation: [],
    confidence: 0.99
  };
}

// ================== LANGUAGE WRAPPERS ==================
function analyzeCPP(code) {
  return analyzeCode(code);
}

function analyzeJava(code) {
  return analyzeCode(code);
}

function analyzePython(code) {
  return analyzeCode(code);
}

module.exports = {
  analyzeCPP,
  analyzeJava,
  analyzePython
};
