// export default function Graph({ graph }) {
//   const { n, operations } = graph;
//   const maxY = Math.max(...operations);

//   return (
//     <div className="mt-6 bg-gray-800 p-4 rounded">
//       <h3 className="mb-2 font-semibold">Growth Graph</h3>

//       <svg width="100%" height="200">
//         {operations.map((y, i) => {
//           const x = 40 + i * 80;
//           const yPos = 180 - (y / maxY) * 150;

//           return (
//             <circle
//               key={i}
//               cx={x}
//               cy={yPos}
//               r="5"
//               fill="#3B82F6"
//             />
//           );
//         })}
//       </svg>

//       <div className="flex justify-between text-xs mt-2 text-gray-400">
//         {n.map(v => (
//           <span key={v}>{v}</span>
//         ))}
//       </div>
//     </div>
//   );
// }
export default function Graph({ graph }) {
  const { n, operations } = graph;

  const width = 600;
  const height = 220;
  const padding = 40;

  const maxVal = Math.max(...operations);
  const minVal = Math.min(...operations);

  // Normalize Y so graph actually curves
  const scaleY = val =>
    height - padding -
    ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);

  const scaleX = index =>
    padding + (index / (n.length - 1)) * (width - 2 * padding);

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded">
      <h3 className="mb-2 font-semibold text-gray-200">Growth Graph</h3>

      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* X axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#6B7280"
        />

        {/* Y axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#6B7280"
        />

        {/* Points + lines */}
        {operations.map((val, i) => {
          const x = scaleX(i);
          const y = scaleY(val);

          return (
            <g key={i}>
              {/* Line to next point */}
              {i < operations.length - 1 && (
                <line
                  x1={x}
                  y1={y}
                  x2={scaleX(i + 1)}
                  y2={scaleY(operations[i + 1])}
                  stroke="#22D3EE"
                  strokeWidth="2"
                />
              )}

              {/* Point */}
              <circle cx={x} cy={y} r="5" fill="#22D3EE" />
            </g>
          );
        })}

        {/* X labels */}
        {n.map((val, i) => (
          <text
            key={i}
            x={scaleX(i)}
            y={height - 10}
            fill="#9CA3AF"
            fontSize="10"
            textAnchor="middle"
          >
            {val}
          </text>
        ))}
      </svg>
    </div>
  );
}
