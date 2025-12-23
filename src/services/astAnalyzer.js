const acorn = require("acorn");
const ot3 = require('./ot3analyzer');
const trian = require('./trian');

function analyze(code, language) {
  if (language === "javascript") return analyzeAST(code);
  if (language === "cpp") return trian.analyzeCPP(code);
  if (language === "java") return trian.analyzeJava(code);
  if (language === "python") return train.analyzePython(code);
  throw new Error("Unsupported language: " + language);
}

// function analyze(code, language) {
//   if (language === "javascript") return analyzeAST(code);
//   if (language === "cpp") return ot3.analyzeCPP(code);
//   if (language === "java") return ot3.analyzeJava(code);
//   if (language === "python") return ot3.analyzePython(code);
//   throw new Error("Unsupported language: " + language);
// }




// function analyzeCPP(code) {
//   let n = 0, log = 0;

//   const forLoops = code.match(/for\s*\(.*?<\s*n.*?\)/g);
//   if (forLoops) n += forLoops.length;

//   const logLoops = code.match(/while\s*\(.*>.*1.*\)\s*\{[^}]*\/=/g);
//   if (logLoops) log += logLoops.length;

//   let time = "O(1)";
//   let parts = [];
//   if (n) parts.push(`n${n>1 ? "^" + n : ""}`);
//   if (log) parts.push("log n");
//   if (parts.length) time = `O(${parts.join(" * ")})`;

//   return {
//     timeComplexity: time,
//     spaceComplexity: "O(1)",
//     confidence: 0.7,
//     explanation: ["Pattern-based static analysis for C++"]
//   };
// }













function analyzeAST(code) {
  const ast = acorn.parse(code, { ecmaVersion: "latest" });

  let currentFunction = null;
  let recursive = false;

  // let loopCostStack = [];
  let maxTimeCost = { n: 0, log: 0 };
  // // let bestTimeCost = { n: 0, log: 0 };
  // let bestTimeCost = { n: Infinity, log: Infinity };

  let hasUnknown = false;

  let spaceN = 0;
  let recursionDepth = 0;

  function cloneCost(c) {
    return { n: c.n, log: c.log };
  }

  // function minCost(a, b) {
  // return {
  //   n: Math.min(a.n, b.n),
  //   log: Math.min(a.log, b.log),
  //   };
  // }


  function maxCost(a, b) {
    return {
      n: Math.max(a.n, b.n),
      log: Math.max(a.log, b.log),
    };
  }

  function detectLoopCost(node) {
    if (!node.test || !node.update) return "unknown";
    if (node.type === "WhileStatement") {
  if (
    node.body &&
    node.body.body &&
    node.body.body.some(
      stmt =>
        stmt.type === "ExpressionStatement" &&
        stmt.expression.type === "AssignmentExpression" &&
        stmt.expression.right.type === "BinaryExpression" &&
        stmt.expression.right.operator === "/"
    )
  ) {
    return "log";
  }
}
    // i < n
    if (
      node.test.type === "BinaryExpression" &&
      node.test.right.type === "Identifier"
    ) {
      // i++
      if (
        node.update.operator === "++" ||
        node.update.operator === "+="
      ) {
        return "n";
      }

      // i /= 2 or i *= 2
      if (
        node.update.operator === "/=" ||
        node.update.operator === "*="
      ) {
        return "log";
      }
    }
    // i = i / 2 OR i = i * 2  → logarithmic
    if (
      node.update.type === "AssignmentExpression" &&
      node.update.right.type === "BinaryExpression" &&
      (node.update.right.operator === "/" ||
      node.update.right.operator === "*") &&
      node.update.right.right.type === "Literal"
    ) {
      return "log";
    }

    return "unknown";
  }

     let timeComplexity = "O(1)";
  let explanation = [];
  function walk(node) {
    if (!node) return;

    // Function context
    if (node.type === "FunctionDeclaration") {
      const prev = currentFunction;
      currentFunction = node.id?.name || null;
      walk(node.body);
      currentFunction = prev;
      return;
    }

    // Loop detection
   // Loop detection (WORST CASE ONLY)

if (
  node.type === "ForStatement" ||
  node.type === "WhileStatement" ||
  node.type === "DoWhileStatement"
) {
  const loopType = detectLoopCost(node);

  let loopCost = { n: 0, log: 0 };
  if (loopType === "n") loopCost.n = 1;
  else if (loopType === "log") loopCost.log = 1;
  else hasUnknown = true;

  // Save cost before loop
  const before = cloneCost(maxTimeCost);

  // Reset for body
  maxTimeCost = { n: 0, log: 0 };

  // Analyze body
  walk(node.body);

  // Combine: OUTER × INNER
  maxTimeCost = {
    n: before.n + loopCost.n + maxTimeCost.n,
    log: before.log + loopCost.log + maxTimeCost.log,
  };

  return;
}




    // Recursion detection
    if (
      node.type === "CallExpression" &&
      node.callee.type === "Identifier" &&
      node.callee.name === currentFunction
    ) {
      recursive = true;
      recursionDepth++;
    }

    // Space detection (arrays / objects)
    if (
      node.type === "NewExpression" &&
      node.arguments.length &&
      node.arguments[0].type === "Identifier"
    ) {
      spaceN++;
    }

    if (
      node.type === "CallExpression" &&
      node.callee.type === "MemberExpression" &&
      node.callee.property.name === "sort"
    ) {
      maxTimeCost.n += 1;
      maxTimeCost.log += 1;
      explanation.push("Built-in sort detected → assumed O(n log n).");
      return;
    }


    // Traverse children
    for (let key in node) {
      const value = node[key];
      if (Array.isArray(value)) {
        value.forEach(child => walk(child));
      } else if (value && typeof value === "object") {
        walk(value);
      }
    }
  }

  walk(ast);

  // ---- Build Time Complexity ----
  // let timeComplexity = "O(1)";
  // let explanation = [];

  if (recursive) {
    timeComplexity = "O(2^n)";
    explanation.push("Recursive self-calls detected (conservative exponential bound).");
  } else {
    let parts = [];
    if (maxTimeCost.n > 0) {
      parts.push(`n${maxTimeCost.n > 1 ? "^" + maxTimeCost.n : ""}`);
    }
    if (maxTimeCost.log > 0) {
      parts.push("log n");
    }

    if (parts.length) {
      timeComplexity = `O(${parts.join(" * ")})`;
      explanation.push("Loop bounds analyzed and combined symbolically.");
    }
  }

  // let bestParts = [];
  // if (bestTimeCost.n !== Infinity && bestTimeCost.log !== Infinity) {
  //   bestParts.push(`n${bestTimeCost.n > 1 ? "^" + bestTimeCost.n : ""}`);
  // }
  // if (bestTimeCost.log > 0) {
  //   bestParts.push("log n");
  // }
  // if (bestParts.length) {
  //   explanation.push(`Best-case time complexity: O(${bestParts.join(" * ")})`);
  // }



  if (hasUnknown) {
    explanation.push("Some loop bounds could not be statically resolved; result is conservative.");
  }

  // ---- Space Complexity ----
  let spaceComplexity = "O(1)";
  if (spaceN > 0 || recursive) {
    spaceComplexity = "O(n)";
    explanation.push("Dynamic memory allocation or recursion stack detected.");
  }

  // ---- Confidence ----
  let confidence = 1.0;
  if (hasUnknown) confidence -= 0.35;
  if (recursive) confidence -= 0.2;
  if (confidence < 0.5) confidence = 0.5;

  return {
    timeComplexity,
    spaceComplexity,
    explanation,
    confidence: Number(confidence.toFixed(2)),
  };
}

module.exports = { analyzeAST , analyze};
