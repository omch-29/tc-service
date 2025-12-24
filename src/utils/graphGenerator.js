function generateGraph(complexity = "O(1)") {
  const nValues = [10, 50, 100, 500, 1000];
  let ops = [];

  // Normalize Θ → O
  complexity = complexity.replace("Θ", "O");

  if (complexity === "O(1)") {
    ops = nValues.map(() => 1);
  }

  else if (complexity === "O(log n)") {
    ops = nValues.map(n => Math.log2(n));
  }

  else if (complexity === "O(n)") {
    ops = nValues.map(n => n);
  }

  else if (complexity === "O(n log n)") {
    ops = nValues.map(n => n * Math.log2(n));
  }

  else if (/O\(n\^\d+\)/.test(complexity)) {
    const power = Number(complexity.match(/\d+/)[0]);
    ops = nValues.map(n => Math.pow(n, power));
  }

  else if (/O\(n\^\d+\s*\*\s*log n\)/.test(complexity)) {
    const power = Number(complexity.match(/\d+/)[0]);
    ops = nValues.map(n => Math.pow(n, power) * Math.log2(n));
  }

  else {
    // fallback
    ops = nValues.map(n => n);
  }

  return {
    n: nValues,
    operations: ops
  };
}

module.exports = { generateGraph };
